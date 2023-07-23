import { stringify } from "querystring";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";

const scope =
  "user-read-private user-read-email playlist-modify-public playlist-modify-private";

// export const runtime = "edge";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const redirectUrl =
    "https://accounts.spotify.com/authorize?" +
    stringify({
      response_type: "code",
      client_id: env.SPOTIFY_CLIENT_ID,
      scope: scope,
      redirect_uri: env.REDIRECT_URI,
      state: "a8Ht7Sb4Zx5Qo2Fp",
    });

  // return NextResponse

  res.status(200).redirect(307, redirectUrl);
}
