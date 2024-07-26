"use server";
import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";
import endent from "endent";

const groqProvider = createOpenAI({
  baseURL: process.env.GROG_API_URL,
  apiKey: process.env.TWITTER_BIO_GENERATOR_KEY_GROQ,
});

// endent is used to format the text same as written
const systemPrompt = endent`
You are an AI assistant tasked with generating Twitter bios based on user input.

Instructions:

Analyze the User's Inputs:
  - Carefully review the provided tone and bio type.
  - Understand the user's core focus and primary activities.

Generate the Bio:

  - Create a bio that succinctly answers:
    - Who is the user?
    - What does the user do?
    - What can others expect from the user?
  - Reflect the given 'Bio Tone' and 'Bio Type' in the style and language of the bio. Do not explicitly mention the tone or type.

Bio Requirements:

  - Use an informal and approachable tone.
  - Do not include hashtags or any words start with #.
  - Highlight the most important information about the user.
  - Avoid using too many buzzwords or overdoing humor.
  - Ensure the bio length is between 120 and 160 characters.
  - Provide at least four different bio options.
  - If 'Add Emojis' is true, include relevant emojis; if false, you must include any emojis.
  - The response must be in JSON format

Additional Guidelines:
  - Maintain clarity and coherence in each bio.
  - Provide response in JSON format only

Do not include any description, do not include the \`\`\`.
  Code (no \`\`\`):
`;

export async function generateBio(
  input: string,
  temperature: number,
  model: string
) {
  const { object: responseData } = await generateObject({
    model: groqProvider(model),
    system: systemPrompt, // this is a prompt for the system and it is used to give the model context on what to do.
    prompt: input,
    temperature,
    maxTokens: 1024,
    schema: z.object({
      responseData: z.array(
        z.object({
          bio: z.string().describe("Add generated bio here."),
        })
      ),
    }),
  });

  return responseData;
}
