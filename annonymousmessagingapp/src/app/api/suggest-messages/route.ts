import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest } from "next/server"; // Corrected import for Next.js

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY, // Ensure this is set in your .env file
});

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Extract the user input (prompt) from the request body
    const { prompt } = await req.json(); // Assuming the prompt is sent in the request body as JSON

    // Check if the user provided a prompt, otherwise use a default one
    const userPrompt = prompt || `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.`;

    // Make the API call to OpenAI with the user-provided (or default) prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      stream: true,
      prompt: userPrompt,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("OpenAI API Error:", error);
      return new Response(error.message, { status: error.status });
    } else {
      console.error("An unexpected error happened:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
}
