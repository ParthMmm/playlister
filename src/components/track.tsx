import Image from "next/image";
import { type Item } from "~/server/api/routers/types";
import { MagicCard, MagicContainer } from "~/components/magicui/magic-card";

const Track = ({ track }: { track: Item | null }) => {
  if (!track) return null;
  return (
    <>
      <MagicContainer className={"flex  h-24 w-full flex-col gap-4 "}>
        <MagicCard className="flex cursor-pointer flex-row items-center justify-between overflow-hidden bg-white p-6 shadow-2xl dark:bg-black">
          <div className="flex items-center align-middle">
            {track.album.images?.[2] ? (
              <Image
                src={track?.album?.images[2].url}
                alt={track.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full"
              />
            ) : null}
            <div className="ml-4 flex flex-col items-start justify-start">
              <div className="text-lg font-medium text-white">{track.name}</div>
              <div className="text-sm font-bold text-white">
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
          </div>
          <div>
            {track.preview_url ? (
              <SongPreview url={track.preview_url} id={track.id} />
            ) : null}
          </div>
          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </MagicCard>
      </MagicContainer>
    </>
  );
};

export default Track;

import React, { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useAtom } from "jotai";
import { playingTrackIdAtom } from "~/store/app";

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
      <button onClick={togglePlay}>{playing ? <Pause /> : <Play />}</button>
      <audio id={id} src={url} ref={audioRef} />
    </div>
  );
};
