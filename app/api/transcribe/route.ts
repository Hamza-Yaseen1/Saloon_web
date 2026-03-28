import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("--- Groq Transcription API Start ---");
  
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("Missing GROQ_API_KEY in environment variables");
      return NextResponse.json({ error: "API configuration error" }, { status: 500 });
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      console.error("No audio file found in form data");
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    console.log(`Audio file received: name=${audioFile.name}, size=${audioFile.size}, type=${audioFile.type}`);

    // Groq's transcription API expects a real file in FormData, which we already have.
    // We'll forward the formData directly or reconstruct it for the Groq endpoint.
    const groqFormData = new FormData();
    groqFormData.append("file", audioFile);
    groqFormData.append("model", "whisper-large-v3");
    groqFormData.append("response_format", "json");

    console.log("Sending request to Groq API...");
    
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API Error:", errorData);
      throw new Error(errorData.error?.message || `Groq API failed with status ${response.status}`);
    }

    const data = await response.json();
    const transcribedText = data.text || "";

    console.log("Transcription successful:", transcribedText.substring(0, 50) + "...");
    return NextResponse.json({ text: transcribedText });

  } catch (error: any) {
    console.error("Transcription error full details:");
    console.error(error);
    
    return NextResponse.json({ 
      error: error.message || "Failed to transcribe audio",
    }, { status: 500 });
  } finally {
    console.log("--- Groq Transcription API End ---");
  }
}
