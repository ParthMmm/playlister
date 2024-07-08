// app/api/chat/route.ts

import { OpenAIStream, StreamingTextResponse, streamText } from "ai";
import { env } from "~/env.mjs";
import { kv } from "@vercel/kv";
import { anthropic } from "@ai-sdk/anthropic";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

// const apiConfig = new Configuration({
//   apiKey: env.OPENAI_API_KEY,
// });

// const openai = new OpenAIApi(apiConfig);

const instructions = `You format text. The text will be a tracklist. The formatted output should be Artist - Song Name. The text will be in different formats. Here are examples:

If there is a timestamp, the timestamp should be removed.
Ignore text that includes ID, ID - ID, - ID.
The text needs to be formatted so it can be searched in Spotify and return the correct result. If the artist field has multiple values and is seperated by x, feat., or anything else format the artists seperated by commas.

Use the following example input and output to learn how to split songs and artists.

Example Input:
Yuzamei - amalgam but its jungle
goreshit - fine night (telemist's remix)
00:00 nuphory feat. Pizza Hotline - Startup Tune
Knock2 vs. Toby Green - JADE vs. In Too Deep
[9:21] Knock2 vs. Sean Kingston - JADE VIP vs. Fire Burning (Knock2 Edit)
Layton Giordani vs. Odd Mob - UFOs & LFOs vs. Left To Right
YehMe2 - Horny Part 2 w/ Buraka Som Sistema - Hangover (BaBaBa) w/ YOGI ft. Pusha T - Burial w/ Masayoshi Iimori - Bomb Breaker
Skeler & Deadcrow - ADRENALIN
Boombox Cartel vs. Lil Nas X & Jack Harlow vs. DJ Ride - Rock Dem vs. Industry Baby vs. TAKETHISWAY (RL Grime Edit)

Example Ouput:
[{\"artist\": \"Yuzamei\", \"song\": \"amalgam but its jungle\"},{\"artist\": \"goreshit\", \"song\": \"fine night (telemist's remix)\"},{\"artist\": \"nuphory, Pizza Hotline\",  \"song\": \"Startup Tune\"},{\"artist\": \"Knock2\", \"song\": \"JADE\"}, {\"artist\": \"Toby Green\", \"song\": \"In Too Deep\"},{\"artist\": \"Knock2\", \"song\": \"JADE VIP\"},{\"artist\": \"Sean Kingston\", \"song\": \"Fire Burning (Knock2 Edit)\"},{\"artist\": \"Layton Giordani\", \"song\": \"UFOs & LFOs\"},{\"artist\": \"Odd Mob\", \"song\": \"Left To Right\"},{\"artist\": \"YehMe2\", \"song\": \"Horny Part 2\"},{\"artist\": \"Buraka Som Sistema\", \"song\": \"Hangover (BaBaBa)\"},{\"artist\": \"YOGI, Pusha T\", \"song\": \"Burial\"},{\"artist\": \"Masayoshi Iimori\", \"song\": \"Bomb Breaker\"},{\"artist\": \"Skeler, Deadcrow\", \"song\": \"ADRENALIN\"},{\"artist\": \"Boombox Cartel\", \"song\": \"Rock Dem\"},{\"artist\": \"Lil Nas X, Jack Harlow\", \"song\": \"Industry Baby\"},{\"artist\": \"DJ Ride\", \"song\": \"TAKETHISWAY (RL Grime Edit)\"}]

]

Please format the songs into a JSON object. Do not include any extra text. Only a json like this [{artist: artist, song: song}].
[no prose]

`;

// ('[\n  {\n    "artist": "RL Grime",\n    "song": "ID1 w/ Erica Banks - Pop Out"\n  },\n  {\n    "artist": "PEEKABOO, ISOxo",\n    "song": "POWERMOVE w/ Major Lazer - Original Don (feat. The Partysquad) w/ W IN K & Nikko - UHD"\n  },\n  {\n    "artist": "Knock2",\n    "song": "JADE"\n  },\n  {\n    "artist": "Toby Green",\n    "song": "In Too Deep"\n  }\n]');
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

  // const cached = await kv.get(key);

  // if (cached) {
  //   // return new Response(cached);
  //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  //   const c = cached as Cache[];
  //   console.log("cache hit");
  //   return new Response(JSON.stringify(c));
  // }

  // Request the OpenAI API for the response based on the prompt
  // const response = await openai.createChatCompletion({
  //   model: "gpt-3.5-turbo",
  //   stream: true,
  //   messages: [
  //     {
  //       role: "user",
  //       content: `${instructions}

  //     These are the songs to format:
  //     ${prompt}
  //     `,
  //     },
  //   ],
  //   // temperature: 0, // you want absolute certainty for spell check
  //   // top_p: 1,
  //   // frequency_penalty: 1,
  //   // presence_penalty: 1,
  // });

  const response = await streamText({
    model: anthropic("claude-3-haiku-20240307"),
  });

  // Convert the response into a friendly text-stream

  // const stream = OpenAIStream(response, {
  //   async onCompletion(completion) {
  //     // Cache the response
  //     await kv.set(key, completion);
  //     // console.log(l);
  //     await kv.expire(key, 60 * 60);
  //   },
  // });

  // Respond with the stream
  return new StreamingTextResponse(response.toAIStream());
}
