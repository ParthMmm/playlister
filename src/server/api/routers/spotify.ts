import { TRPCError } from "@trpc/server";
import { stringify } from "querystring";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const spotifyRouter = createTRPCRouter({
  getToken: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const { code } = input;

      if (!code) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No code provided",
        });
      }

      console.log({ code });

      const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
        form: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: env.REDIRECT_URI,
        },
        json: true,
      };

      const data = await fetch(authOptions.url, {
        method: "POST",
        headers: authOptions.headers,
        body: stringify(authOptions.form),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const body = await data.json();

      console.log(body);

      return body as {
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
      };

      //   res.status(200).json(body);
    }),
});
