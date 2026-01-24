import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY, // Fallback to OPENAI_API_KEY
  baseURL: "https://openrouter.ai/api/v1",
});

// Define types
interface BookingData {
  name?: string;
  services?: string[];
  price?: number;
  time?: string;
  date?: string;
  visitTime?: string;
}

interface ChatSession {
  step: number; // 0-5 representing the current step in the conversation
  bookingData: BookingData;
  context: string; // Conversation context
}

// In-memory storage for sessions (in production, use Redis or database)
const sessions = new Map<string, ChatSession>();

// Define the conversation steps
const CONVERSATION_STEPS = [
  "What is your name?",
  "What service(s) would you like to book?",
  "When would you like to visit? (today/tomorrow/specific date)",
  "What time would you like to come? (e.g., 2:00 PM, 6:30 PM)",
  "Please confirm your appointment details.",
  "Your appointment is confirmed!"
];

// Define services as source of truth
const SERVICES_DATA = {
  "Haircut": 34,
  "Shave": 42,
  "Beard trim": 18,
  "Kids haircut": 28,
  "Express line-up": 12,
  "Wash & style": 16,
  "Royal shave": 50
};

// Define shop hours
const SHOP_HOURS = {
  open: "9:00 AM",
  close: "9:00 PM",
  openHour: 9,
  closeHour: 21
};

// Barber shop specific context - Updated with new rules
const BARBER_SHOP_CONTEXT = `
You are a professional appointment-booking assistant for Barbar Barbershop.

SERVICES_DATA:
${JSON.stringify(SERVICES_DATA, null, 2)}

SHOP_HOURS:
• Open: ${SHOP_HOURS.open}
• Close: ${SHOP_HOURS.close}

This information is the SINGLE SOURCE OF TRUTH. Do NOT assume, fetch, or invent any data.

RULES:
1. GREETING CONTROL (CRITICAL)
- Greet the user ONLY ONCE per conversation.
- Never repeat “Hello”, “Welcome”, or reintroduce the shop after the first greeting.
- If the user says “hi / hello” after the first greeting, respond briefly without repeating the greeting.

2. SERVICES & PRICING
- ONLY offer services listed in SERVICES_DATA.
- Never invent, rename, or confirm unavailable services.
- Always calculate totals using SERVICES_DATA.
- Prices are numeric only (no currency name or symbol).

3. DISCOUNTS
- NEVER offer a discount unless the user explicitly asks.
- If the user asks, explain clearly and ask for confirmation before applying.

4. MEMORY & FLOW
- Remember and reuse: Name, Selected services, Date, Time, AM / PM.
- Never ask the same question twice.
- Follow this order strictly: greeting → name → service → date → time → AM/PM → validation → confirmation.

5. TIME INPUT HANDLING
- If the user provides a time without AM or PM (e.g., “10”):
  Ask: “Is that 10 AM or 10 PM?”
- Do NOT assume AM or PM.

6. SHOP HOURS VALIDATION
- Validate the requested time against SHOP_HOURS (9:00 AM – 9:00 PM).
- If the time is outside hours:
  • Inform the user the shop is closed.
  • Offer the nearest valid open time.
- Never confirm bookings outside shop hours.

7. FINAL CONFIRMATION FORMAT (MANDATORY)
Before confirming, ALWAYS show:
"Please confirm your appointment:
• Name: [Name]
• Services: [Services]
• Date: [Date]
• Time (with AM/PM): [Time]
• Total price: [Total]

Reply YES to confirm or NO to make changes."

8. CONSISTENCY
- Never restart the conversation.
- Never contradict previous responses.
- Never fabricate availability or prices.

9. MULTI-SERVICE INPUT HANDLING
- If a user mentions more than one service in a single message (e.g., “Royal shave Haircut”):
  • Treat them as separate services.
  • Match each service individually against SERVICES_DATA.
- Do NOT treat multiple services as a single service name.
- If all mentioned services are valid, accept them and continue.

10. TONE
- Polite, friendly, concise, and professional.
- Avoid robotic repetition.
`;

/**
 * Sends a WhatsApp notification using Meta's WhatsApp Cloud API
 */
async function sendWhatsAppNotification(bookingData: BookingData): Promise<boolean> {
  try {
    // Validate required environment variables
    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const recipientNumber = process.env.BARBER_WHATSAPP_NUMBER;

    if (!whatsappToken || !phoneNumberId || !recipientNumber) {
      console.error('WhatsApp credentials are not configured properly');
      return false;
    }

    // Format the message
    const messageText = `New Client Booking:\nName: ${bookingData.name || 'N/A'}\nServices: ${bookingData.services?.join(', ') || 'N/A'}\nPrice: $${bookingData.price || 'N/A'}\nTime: ${bookingData.time || 'N/A'}\nDate: ${bookingData.date || 'N/A'}\nVisit Time: ${bookingData.visitTime || 'N/A'}`;

    // Prepare the payload for WhatsApp Cloud API
    const payload = {
      messaging_product: 'whatsapp',
      to: recipientNumber,
      type: 'text',
      text: {
        body: messageText
      }
    };

    // Send the message using WhatsApp Cloud API
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${whatsappToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );

    const result = await response.json();

    if (response.ok) {
      console.log('WhatsApp notification sent successfully:', result);
      return true;
    } else {
      console.error('Failed to send WhatsApp notification:', result);
      return false;
    }
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Validate API key (either OpenRouter or OpenAI)
    if (!process.env.OPENROUTER_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key is not configured (either OPENROUTER_API_KEY or OPENAI_API_KEY required)' },
        { status: 500 }
      );
    }

    // Get or create session
    let session = sessions.get(sessionId) || {
      step: 0,
      bookingData: {},
      context: BARBER_SHOP_CONTEXT + "\n\nAssistant: Hello! Welcome to Barbar Barbershop. I'm here to help you book an appointment. What is your name?"
    };

    // Store previous step to detect completion
    const prevStep = session.step;

    // Update the message in the session context
    session.context += `\n\nCustomer: ${message}`;

    // Process the user's message with OpenRouter (compatible with OpenAI API)
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-3.5-turbo', // OpenRouter format
      messages: [
        {
          role: 'system',
          content: session.context
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const aiResponse = completion.choices[0]?.message?.content?.trim() || '';

    // Update the assistant's response in the session context
    session.context += `\n\nAssistant: ${aiResponse}`;

    // Extract information based on the current step
    switch (session.step) {
      case 0: // Name
        // Extract name from the conversation or AI response
        const nameMatch = message.match(/(?:my name is|i am|i'm|call me|it's)\s+([a-zA-Z\s]+)/i) ||
          aiResponse.match(/Hello\s+([a-zA-Z]+)/i);
        if (nameMatch) {
          session.bookingData.name = nameMatch[1].trim();
          session.step = 1;
        }
        break;

      case 1: // Services
        // Sort services by length descending to match "Royal shave" before "Shave"
        const sortedServices = Object.entries(SERVICES_DATA).sort((a, b) => b[0].length - a[0].length);

        const selectedServices: string[] = [];
        let total = 0;
        let remainingMessage = message.toLowerCase();

        for (const [service, price] of sortedServices) {
          const lowerService = service.toLowerCase();
          if (remainingMessage.includes(lowerService)) {
            selectedServices.push(service);
            total += price;
            // Remove the matched service from remainingMessage to avoid double matching substrings
            remainingMessage = remainingMessage.replace(lowerService, " ");
          }
        }

        if (selectedServices.length > 0) {
          session.bookingData.services = selectedServices;
          session.bookingData.price = total;
          session.step = 2;
        }
        break;

      case 2: // Date
        // Try to extract a date
        const dateMatch = message.match(/(today|tomorrow|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|\w+\s+\d{1,2})/i);
        if (dateMatch) {
          session.bookingData.date = dateMatch[0];
          session.step = 3;
        }
        break;

      case 3: // Time & AM/PM & Validation
        const timeWithAMPM = message.match(/(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);
        const timeOnly = message.match(/(\d{1,2}(?::\d{2})?)/i);

        if (timeWithAMPM) {
          const timeStr = timeWithAMPM[0].toUpperCase();
          // Basic hour validation for shop hours
          const hourMatch = timeStr.match(/(\d{1,2})/);
          if (hourMatch) {
            let hour = parseInt(hourMatch[1]);
            const isPM = timeStr.includes('PM');
            if (isPM && hour < 12) hour += 12;
            if (!isPM && hour === 12) hour = 0;

            if (hour >= SHOP_HOURS.openHour && hour < SHOP_HOURS.closeHour) {
              session.bookingData.visitTime = timeStr;
              session.step = 4;
            } else {
              // Time outside shop hours, session.step stays at 3
              // The AI will handle informing the user based on the prompt instructions
            }
          }
        } else if (timeOnly) {
          // Time provided without AM/PM, session.step stays at 3
          // The AI will handle asking "Is that 10 AM or 10 PM?"
        }
        break;

      case 4: // Confirmation
        if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('confirm') || message.toLowerCase().includes('correct')) {
          session.step = 5; // Completed
        } else if (message.toLowerCase().includes('no') || message.toLowerCase().includes('change')) {
          // Stay in step 4 or go back? Flow says "NO to make changes". 
          // For simplicity, we'll let the AI handle the changes, but keep state at 4 until YES.
        }
        break;
    }

    // Check if booking was just completed (moved from step 4 to 5)
    const justCompleted = prevStep === 4 && session.step === 5;

    // Update session in memory
    sessions.set(sessionId, session);

    // Prepare response
    let response = {
      chatbotReply: aiResponse,
      bookingData: session.bookingData,
      completed: session.step >= 5, // Mark as completed when all info collected
      currentStep: session.step,
      totalSteps: CONVERSATION_STEPS.length
    };

    // If booking is just completed, send WhatsApp notification
    if (justCompleted) {
      // Send WhatsApp notification in the background (don't wait for it)
      sendWhatsAppNotification(session.bookingData).catch(error => {
        console.error('Error sending WhatsApp notification:', error);
      });
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in chat API:', error);

    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          error: 'API key is invalid or not configured properly',
          chatbotReply: 'I\'m having trouble connecting to our system right now. Please try again later.'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        chatbotReply: 'I\'m having trouble processing your request. Please try again.'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Barber Shop AI Chatbot API'
  });
}