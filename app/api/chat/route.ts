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
  "What is your budget/expected total price?",
  "How much time do you expect for this visit?",
  "When would you like to visit? (today/tomorrow/specific date)",
  "What time would you like to come? (e.g., 2:00 PM, 6:30 PM)"
];

// Barber shop specific context
const BARBER_SHOP_CONTEXT = `
You are a friendly and professional assistant at Barbar Barbershop in Manhattan, New York.
Your goal is to collect information from the customer to book an appointment.
Follow the conversation flow strictly in this order:
1. Ask for their name
2. Ask for the service(s) they need
3. Ask about their expected price/budget
4. Ask about estimated time needed
5. Ask for the preferred date (today/tomorrow/specific date)
6. Ask for the preferred time

Our services include:
- Haircut ($34+)
- Shave ($42+)
- Beard trim ($18+)
- Kids haircut ($28+)
- Express line-up ($12+)
- Wash & style ($16+)
- Royal shave ($50+)

Our hours are:
- Monday-Friday: 9AM-8PM
- Saturday: 8AM-9PM
- Sunday: 10AM-6PM

Keep responses conversational and friendly. Once you have all information, confirm the booking details.
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
      context: BARBER_SHOP_CONTEXT
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

    // Extract information based on the current step
    switch (session.step) {
      case 0: // Name
        // Extract name from the conversation
        const nameMatch = message.match(/(?:my name is|i am|i'm|call me)\s+(\w+)/i);
        if (nameMatch) {
          session.bookingData.name = nameMatch[1];
          session.step = 1;
        } else {
          // If we couldn't extract the name, ask again
          session.step = 0;
        }
        break;

      case 1: // Services
        // Extract services mentioned in the message
        const serviceMatches = [];
        const serviceKeywords = ['haircut', 'shave', 'beard', 'trim', 'kids', 'express', 'wash', 'style', 'royal'];

        for (const keyword of serviceKeywords) {
          if (message.toLowerCase().includes(keyword)) {
            serviceMatches.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
          }
        }

        if (serviceMatches.length > 0) {
          session.bookingData.services = serviceMatches;
          session.step = 2;
        } else {
          // If no services detected, ask again
          session.step = 1;
        }
        break;

      case 2: // Price
        // Extract price from the message
        const priceMatch = message.match(/\$?(\d+(?:\.\d+)?)/);
        if (priceMatch) {
          session.bookingData.price = parseFloat(priceMatch[1]);
          session.step = 3;
        } else {
          // If no price detected, ask again
          session.step = 2;
        }
        break;

      case 3: // Time
        // Extract time from the message
        const timeMatch = message.match(/(\d+)\s*(minutes?|mins?|hrs?|hours?)/i);
        if (timeMatch) {
          session.bookingData.time = `${timeMatch[1]} ${timeMatch[2]}`;
          session.step = 4;
        } else {
          // If no time detected, ask again
          session.step = 3;
        }
        break;

      case 4: // Date
        if (message.toLowerCase().includes('today')) {
          session.bookingData.date = 'Today';
          session.step = 5;
        } else if (message.toLowerCase().includes('tomorrow')) {
          session.bookingData.date = 'Tomorrow';
          session.step = 5;
        } else {
          // Try to extract a specific date
          const dateRegex = /(\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|\w+\s+\d{1,2}(?:,\s*\d{4})?)/;
          const dateMatch = message.match(dateRegex);
          if (dateMatch) {
            session.bookingData.date = dateMatch[0];
            session.step = 5;
          } else {
            // If no date detected, ask again
            session.step = 4;
          }
        }
        break;

      case 5: // Time of day
        // Extract time of day from the message
        const timeOfDayMatch = message.match(/(\d{1,2}:\d{2}\s*(?:AM|PM)|\d{1,2}\s*(?:AM|PM)|\d{1,2}:\d{2})/i);
        if (timeOfDayMatch) {
          session.bookingData.visitTime = timeOfDayMatch[0].toUpperCase();
          // All information collected, finalize booking
          session.step = 6; // Completed
        } else {
          // If no time detected, ask again
          session.step = 5;
        }
        break;
    }

    // Check if booking was just completed (moved from step 5 to 6)
    const justCompleted = prevStep === 5 && session.step === 6;

    // Update session in memory
    sessions.set(sessionId, session);

    // Prepare response
    let response = {
      chatbotReply: aiResponse,
      bookingData: session.bookingData,
      completed: session.step >= 6, // Mark as completed when all info collected
      currentStep: session.step,
      totalSteps: CONVERSATION_STEPS.length
    };

    // If we're moving to the next step, append the next question
    if (session.step < CONVERSATION_STEPS.length && session.step > 0) {
      response.chatbotReply += `\n\n${CONVERSATION_STEPS[session.step]}`;
    }

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