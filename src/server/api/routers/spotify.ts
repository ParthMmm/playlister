import { TRPCError } from "@trpc/server";
import { stringify } from "querystring";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { kv } from "@vercel/kv";
import {
  type Tracks,
  type Item,
  type Playlist,
} from "~/server/api/routers/types";

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

type Songs = Song[];

type Song = {
  artist: string;
  song: string;
};

type Cache = {
  goodResults: ReturnSong[];
  badResults: ReturnSong[];
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
    .input(
      z.object({ userId: z.string(), token: z.string(), prompt: z.string() })
    )
    .query(async ({ input }) => {
      const { userId, token, prompt } = input;

      try {
        if (!token) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No token provided",
          });
        }

        const key = `${userId}-${prompt}`;

        const songs: Songs | null = await kv.get(key);

        if (!songs) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "No songs provided",
          });
        }

        const spotKey = `${userId}-${prompt}-spotify`;
        const cached = await kv.get(spotKey);

        if (cached) {
          const c = cached as Cache;
          return {
            goodResults: c.goodResults,
            badResults: c.badResults,
          };
        }

        const results = await searchSongs(songs, token);

        if (!results) return null;

        //filter any null results
        const filteredResults = results.filter((result) => result !== null);

        //sort successfull results where tracks are not null
        const goodResults = filteredResults.filter(
          (result) => result?.track !== null
        ) as ReturnSong[];

        //get all tracks that are null
        const badResults = filteredResults.filter(
          (result) => result?.track === null
        ) as ReturnSong[];

        await kv.set(spotKey, {
          goodResults,
          badResults,
        });
        await kv.expire(spotKey, 60 * 60);

        return {
          goodResults,
          badResults,
        };
      } catch (error: unknown) {
        const e = error as Error;

        console.error({
          message: e.message,
          input,
          function: "getSongs",
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: e.message,
        });
      }

      // return songs;
    }),

  createPlaylist: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        token: z.string(),
        removedTracks: z.array(z.string()),
        prompt: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { userId, token, removedTracks, prompt } = input;

      try {
        const spotKey = `${userId}-${prompt}-spotify`;
        const cached = await kv.get(spotKey);

        const authOptions = {
          url: `https://api.spotify.com/v1/users/${userId}/playlists`,
          headers: {
            Authorization: "Bearer " + token,
          },
          json: true,
        };

        const data = await fetch(authOptions.url, {
          method: "POST",
          headers: authOptions.headers,
          body: JSON.stringify({
            name: "Playlistify",
            description: "Playlist created by Playlistify",
            public: true,
          }),
        });

        const playlist = (await data.json()) as Playlist;

        const playlistId = playlist.id;
        const playlistUrl = playlist.external_urls.spotify;

        if (cached) {
          const c = cached as Cache;
          const goodResults = c.goodResults as {
            artist: string;
            song: string;
            track: Item;
          }[];

          //filter out removed tracks
          const filteredResults = goodResults.filter(
            (result) => !removedTracks.includes(result?.track?.id)
          );

          const authOptions = {
            url: `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
            headers: {
              Authorization: "Bearer " + token,
            },
            json: true,
          };

          const data = await fetch(authOptions.url, {
            method: "POST",
            headers: authOptions.headers,
            body: JSON.stringify({
              uris: filteredResults.map((result) => result.track.uri),
            }),
          });

          if (data.ok) {
            return playlistUrl;
          }
        }
      } catch (error: unknown) {
        const e = error as Error;

        console.error({
          message: e.message,
          input,
          function: "createPlaylist",
        });

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: e.message,
        });
      }
    }),
});

export type ReturnSong = {
  artist: string;
  song: string;
  track: Item | null;
};

async function searchSongs(
  songs: Songs,
  token: string
): Promise<(ReturnSong | null)[]> {
  try {
    const promises = songs.map((song: Song) => getTracks(song, token));
    const results = await Promise.all(promises);
    return results;
  } catch (error: unknown) {
    const e = error as Error;

    console.error({
      message: e.message,
      function: "searchSongs",
    });

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: e.message,
    });
  }
}

const getTracks = async (song: Song, token: string) => {
  const authOptions = {
    url: `https://api.spotify.com/v1/search`,
    headers: {
      Authorization: "Bearer " + token,
    },
    json: true,
  };

  try {
    const res = await fetch(
      `${authOptions.url}?q=track:${encodeURIComponent(
        song.song
      )}%20artist:${encodeURIComponent(song.artist)}&type=track`,
      {
        method: "GET",
        headers: authOptions.headers,
      }
    );

    if (!res.ok) {
      console.log(`${song.artist} - ${song.song} not found`);
      // throw new Error(`${song.artist} - ${song.song} not found`);
      return {
        artist: song.artist,
        song: song.song,
        track: null,
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const data: Tracks | null = await res.json();

    if (data?.tracks?.items.length === 0) {
      return {
        artist: song.artist,
        song: song.song,
        track: null,
      };
    }

    return {
      artist: song.artist,
      song: song.song,
      track: data?.tracks?.items[0] ?? null,
    };
  } catch (e: unknown) {
    const error = e as Error;
    console.error({
      message: error.message,
      function: "getTracks",
    });
  }
  return null;
};
