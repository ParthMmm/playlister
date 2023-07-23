import { TRPCError } from "@trpc/server";
import { stringify } from "querystring";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { kv } from "@vercel/kv";

type User = {
  display_name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  type: string;
  uri: string;
  followers: {
    href: null | string;
    total: number;
  };
  country: string;
  product: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  email: string;
};

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

      return body as {
        access_token: string;
        token_type: string;
        expires_in: number;
        refresh_token: string;
        scope: string;
      };

      //   res.status(200).json(body);
    }),

  getUser: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No token provided",
        });
      }

      const authOptions = {
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + token,
        },
        json: true,
      };

      const data = await fetch(authOptions.url, {
        method: "GET",
        headers: authOptions.headers,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user: User = await data.json();

      return user;
    }),

  getSongs: publicProcedure
    .input(z.object({ userId: z.string(), token: z.string() }))
    .query(async ({ input }) => {
      const { userId, token } = input;

      if (!token) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No token provided",
        });
      }

      const songs = await kv.get(userId);

      if (!songs) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No songs provided",
        });
      }

      // const authOptions = {
      //   url: `https://api.spotify.com/v1/search`,
      //   headers: {
      //     Authorization: "Bearer " + token,
      //   },
      //   json: true,
      // };

      // const data = await fetch(
      //   `${authOptions.url}?q=${userId}&type=track&limit=10`,
      //   {
      //     method: "GET",
      //     headers: authOptions.headers,
      //   }
      // );

      return songs;
    }),
});
