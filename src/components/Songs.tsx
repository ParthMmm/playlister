import { useAtomValue, useSetAtom } from "jotai";
import Track from "~/components/track";
import { type ReturnSong } from "~/server/api/routers/spotify";
import { lengthAtom, tokenAtom } from "~/store/app";
import { api } from "~/utils/api";
import { motion, stagger } from "framer-motion";
import Counter from "~/components/counter";
import { useEffect } from "react";

type Props = {
  userId: string;
  formatted: boolean;
};

const Songs = ({ userId, formatted }: Props) => {
  const token = useAtomValue(tokenAtom);
  const setLength = useSetAtom(lengthAtom);

  const songs = api.spotify.getSongs.useQuery(
    { token: token?.access_token, userId },
    {
      enabled: !!token.access_token && !!userId && !!formatted,
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (songs.data) {
      setLength({
        good: songs.data.goodResults.length,
        bad: songs.data.badResults.length,
      });
    }
  }, [setLength, songs.data]);

  if (!songs.data) return null;

  if (songs.data) {
    return (
      <div className="no-scrollbar flex h-[calc(100vh-4rem)] flex-col overflow-auto scroll-smooth p-4">
        <div className="space-y-4">
          {songs.data.goodResults.map((song, i) => (
            <motion.div
              initial={{ opacity: 0, y: "140%" }}
              // animate={{ opacity: 1, y: "0%" }}
              transition={{
                duration: 1.3,
                // delayChildren: 0.2,
                ease: [0.075, 0.82, 0.165, 1],
                staggerChildren: 0.2,
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: "0%" }}
              key={song.track?.id}
              className="flex flex-col items-center justify-center"
              layout
            >
              <Track track={song?.track} key={song.track?.id} />
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center">
          {songs.data.badResults.map((song) => (
            <div key={`${song?.song} + ${song.artist}`}>
              <p className="text-2xl font-semibold text-white">{song?.song}</p>
              <p className="text-lg font-semibold text-white">{song?.artist}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default Songs;
