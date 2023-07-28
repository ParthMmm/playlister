import { useAtomValue, useSetAtom } from "jotai";
import Track from "~/components/track";
import { formattedAtom, lengthAtom, promptAtom, tokenAtom } from "~/store/app";
import { api } from "~/utils/api";
import { motion } from "framer-motion";

import { useEffect } from "react";
import FailTrack from "~/components/fail-track";

type Props = {
  userId: string;
};

const Songs = ({ userId }: Props) => {
  const token = useAtomValue(tokenAtom);
  const setLength = useSetAtom(lengthAtom);
  const formatted = useAtomValue(formattedAtom);
  const prompt = useAtomValue(promptAtom);

  const songs = api.spotify.getSongs.useQuery(
    { token: token?.access_token, userId, prompt },
    {
      enabled: !!token.access_token && !!userId && !!formatted && !!prompt,
      keepPreviousData: true,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  useEffect(() => {
    if (songs.data) {
      setLength({
        good: songs?.data.goodResults.length,
        bad: songs?.data.badResults.length,
      });
    }
  }, [setLength, songs.data]);

  if (!songs.data) return null;

  if (songs.data) {
    //put all track uris in an array

    return (
      <motion.div
        initial={{ opacity: 0, y: "0%" }}
        animate={{ opacity: 1, y: "0%" }}
        transition={{
          duration: 1.3,
          // delay: 1,
          type: "tween",
          ease: [0.075, 0.82, 0.165, 1],
        }}
        exit={{ opacity: 0, y: "0%" }}
        className="no-scrollbar flex h-[calc(100vh-4rem)] w-full  flex-col overflow-auto scroll-smooth p-4 md:w-1/2"
      >
        <div className="space-y-4">
          {songs.data.goodResults.map((song) => (
            <motion.div
              initial={{ opacity: 0, y: "140%" }}
              // animate={{ opacity: 1, y: "0%" }}
              transition={{
                duration: 1.3,
                // delayChildren: 0.2,
                type: "tween",
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

        <motion.span
          initial={{ opacity: 0, y: "140%" }}
          transition={{
            duration: 1.3,
            ease: [0.075, 0.82, 0.165, 1],
          }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: "0%" }}
          className="my-4  text-left font-semibold md:ml-4"
        >
          Songs Not Found
        </motion.span>
        <div className="mb-16 space-y-4">
          {songs.data.badResults.map((song) => (
            <motion.div
              initial={{ opacity: 0, y: "140%" }}
              transition={{
                duration: 1.3,
                ease: [0.075, 0.82, 0.165, 1],
                staggerChildren: 0.2,
              }}
              viewport={{ once: true }}
              whileInView={{ opacity: 1, y: "0%" }}
              key={`${song?.song} + ${song.artist}`}
              className="flex flex-col items-center justify-center"
              layout
            >
              <FailTrack track={song} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  console.log("a");

  return null;
};

export default Songs;
