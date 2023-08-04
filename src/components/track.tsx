import Image from "next/image";
import { type Item } from "~/server/api/routers/types";
import React, { useEffect, useRef } from "react";
import { Check, Pause, Play, X } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { playingTrackIdAtom, removedTracksAtom } from "~/store/app";
import { cn } from "~/lib/utils";
import { motion } from "framer-motion";

const Track = ({ track }: { track: Item | null }) => {
  const playingTrackId = useAtomValue(playingTrackIdAtom);
  const [removedTracks, setRemovedTracks] = useAtom(removedTracksAtom);
  const playing = track?.id === playingTrackId;

  if (!track) return null;
  const removed = removedTracks.includes(track?.id);

  const button = {
    initial: {
      opacity: 0,
      x: "100%",
    },

    whileHover: {
      opacity: 1,
      x: "0%",
      transition: {
        duration: 0.2,
        type: "tween",
        ease: [0.075, 0.82, 0.165, 1],
      },
      textColor: "#f87171",
    },
  };

  const container = {
    initial: {
      x: 0,
      transition: {
        duration: 2,
        type: "tween",
        ease: [0.075, 0.82, 0.165, 1],
      },
    },

    whileHover: {
      scale: 1.01,
      transition: {
        duration: 0.2,
        type: "tween",
        ease: [0.075, 0.82, 0.165, 1],
      },
    },
  };

  return (
    <motion.div
      className="group relative ml-0 mr-6 w-full md:ml-6 md:mr-0"
      variants={container}
      initial="initial"
      whileHover="whileHover"
    >
      <div
        className={cn(
          "flex h-20 flex-row items-center justify-between overflow-hidden rounded-lg border-2  border-zinc-200 bg-transparent p-4 align-middle text-zinc-900 shadow-md transition-opacity  hover:border-zinc-500 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-100",
          `${removed ? "opacity-50" : null}`
        )}
      >
        <div className="flex items-center ">
          {track.album.images?.[2] ? (
            <motion.div
              animate={{
                rotate: playing ? 360 : 0,
                transition: {
                  duration: 1,
                  type: "tween",
                  ease: "linear",
                  repeat: playing ? Infinity : 0,
                },
              }}
            >
              <Image
                src={track?.album?.images[2].url}
                alt={track.name}
                width={48}
                height={48}
                className={cn("h-12 w-12 rounded-full")}
              />
            </motion.div>
          ) : null}
          <div className="ml-4 flex flex-col flex-wrap items-start justify-start overflow-hidden">
            <div className="truncate text-base font-medium ">{track.name}</div>
            <div className="truncate text-xs font-bold ">
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
          </div>
        </div>
        <div className="invisible group-hover:visible">
          {track.preview_url ? (
            <SongPreview url={track.preview_url} id={track.id} />
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-0 top-0 m-auto h-full transform pb-1 md:-left-7">
        {removed ? (
          <motion.button
            className="h-full rounded-2xl font-bold text-zinc-500 transition-colors hover:text-green-500 "
            variants={button}
            onClick={() => {
              setRemovedTracks(
                removedTracks.filter(
                  (removedTrack) => removedTrack !== track.id
                )
              );
            }}
          >
            <Check className="h-6 w-6 " />
          </motion.button>
        ) : (
          <motion.button
            className="h-full rounded-2xl font-bold text-zinc-500 transition-colors hover:text-red-500 "
            variants={button}
            onClick={() => {
              setRemovedTracks([...removedTracks, track.id]);
            }}
          >
            <X className="h-6 w-6 " />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Track;

type Props = {
  url: string;
  id: string;
};

const SongPreview = ({ url, id }: Props) => {
  const [playingTrackId, setPlayingTrackId] = useAtom(playingTrackIdAtom);
  const playing = id === playingTrackId;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      if (playing) {
        void audioElement.play();
      } else {
        audioElement.pause();
      }
    }
  }, [id, playing, playingTrackId]);

  const togglePlay = () => {
    if (playing) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(id);
    }
  };

  if (!url) return null;

  return (
    <div>
      <button onClick={togglePlay}>
        {playing ? (
          <Pause className="h-6 w-6 text-zinc-500" />
        ) : (
          <Play className="h-6 w-6 text-zinc-500" />
        )}
      </button>
      <audio id={id} src={url} ref={audioRef} />
    </div>
  );
};
