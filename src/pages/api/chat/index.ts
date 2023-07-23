// app/api/chat/route.ts

import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "~/env.mjs";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(apiConfig);

const x = [] as ChatCompletionRequestMessage[];

x.push({
  role: "system",
  content: `You format text. The text will be a tracklist. The formatted output should be Artist - Song Name. The text will be in different formats. Here are examples: 
    Yuzamei - amalgam but its jungle, 00:00 nuphory feat. Pizza Hotline - Startup Tune, goreshit - fine night (telemist's remix). 
   
   If there is a timestamp, the timestamp should be removed. The text needs to be formatted so it can be searched in Spotify and return the correct result. If the artist field has multiple values and is seperated by x, feat., or anything else format the artists seperated by commas. 
   Please format the songs into a JSON object. 
   Example: nuphory feat. Pizza Hotline - Startup Tune
  should return [{artist: nuphory, Pizza Hotline,  song: Startup Tune}]
  
  `,
});

export default async function handler(req: Request) {
  // Extract the `messages` from the body of the request
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { messages }: { messages: ChatCompletionRequestMessage[] } =
    await req.json();

  if (!messages?.[0]) {
    throw new Error("No messages");
  }

  x.push(messages?.[0]);

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: x,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}