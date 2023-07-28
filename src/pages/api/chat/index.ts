// app/api/chat/route.ts

import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { env } from "~/env.mjs";
import { kv } from "@vercel/kv";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const apiConfig = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(apiConfig);

const instructions = `You format text. The text will be a tracklist. The formatted output should be Artist - Song Name. The text will be in different formats. Here are examples: 
Yuzamei - amalgam but its jungle, 00:00 nuphory feat. Pizza Hotline - Startup Tune, goreshit - fine night (telemist's remix). 

If there is a timestamp, the timestamp should be removed. 
Ignore text that includes ID, ID - ID, - ID.
The text needs to be formatted so it can be searched in Spotify and return the correct result. If the artist field has multiple values and is seperated by x, feat., or anything else format the artists seperated by commas. 
Please format the songs into a JSON object. 
Example: nuphory feat. Pizza Hotline - Startup Tune
should return [{artist: nuphory, Pizza Hotline,  song: Startup Tune}]

If the text includes vs. the text should be split like this:

Input:
Knock2 vs. Toby Green - JADE vs. In Too Deep
[9:21] Knock2 vs. Sean Kingston - JADE VIP vs. Fire Burning (Knock2 Edit)

Ouput:
Knock2 - JADE
Toby Green - In Too Deep
Knock2 - JADE VIP
Sean Kingston - Fire Burning (Knock2 Edit)`;

type Body = {
  prompt: string;
  userId: string;
};

type Cache = {
  artist: string;
  song: string;
};

export default async function handler(req: Request) {
  // Extract the `messages` from the body of the request
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { prompt, userId }: Body = await req.json();

  if (!userId) {
    throw new Error("No userId");
  }
  const key = `${userId}-${prompt}`;

  const cached = await kv.get(key);

  if (cached) {
    // return new Response(cached);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const c = cached as Cache[];
    console.log("cache hit");
    return new Response(JSON.stringify(c));
  }

  // Request the OpenAI API for the response based on the prompt
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [
      {
        role: "user",
        content: `You format text. The text will be a tracklist. The formatted output should be Artist - Song Name. The text will be in different formats. Here are examples: 
        Yuzamei - amalgam but its jungle, 00:00 nuphory feat. Pizza Hotline - Startup Tune, goreshit - fine night (telemist's remix). 
       
       If there is a timestamp, the timestamp should be removed. The text needs to be formatted so it can be searched in Spotify and return the correct result. If the artist field has multiple values and is seperated by x, feat., or anything else format the artists seperated by commas. 
       Please format the songs into a JSON object. 
       Example: nuphory feat. Pizza Hotline - Startup Tune
      should return [{artist: nuphory, Pizza Hotline,  song: Startup Tune}]
      
      These are the songs to format:
      ${prompt}
      `,
      },
    ],
    // temperature: 0, // you want absolute certainty for spell check
    // top_p: 1,
    // frequency_penalty: 1,
    // presence_penalty: 1,
  });

  // Convert the response into a friendly text-stream

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      // Cache the response
      await kv.set(key, completion);
      // console.log(l);
      await kv.expire(key, 60 * 60);
    },
  });

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
