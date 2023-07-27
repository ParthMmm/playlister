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
            {track.preview_url ? <SongPreview url={track.preview_url} /> : null}
          </div>
          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </MagicCard>
      </MagicContainer>

      {/* <MagicContainer className="flex w-full  items-center justify-between rounded-md  p-2 px-4  ">
        <MagicCard className="flex cursor-pointer items-center justify-center overflow-hidden bg-white shadow-2xl dark:bg-black ">
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
            {track.preview_url ? <SongPreview url={track.preview_url} /> : null}
          </div>
          <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        </MagicCard>
      </MagicContainer> */}
    </>
  );
};

export default Track;

import React, { useState } from "react";
import { Pause, Play } from "lucide-react";

type Props = {
  url: string;
};

const SongPreview = ({ url }: Props) => {
  const [playing, setPlaying] = useState(false);

  if (!url) return null;

  // const url =
  //   "https://p.scdn.co/mp3-preview/fde9deb1631b5d866f2544c058e289f48a1b56af?cid=f9b8bb5c5e264be2be7f76fca58e2a72";

  const togglePlay = () => {
    const audioElement: HTMLAudioElement | null =
      document.querySelector("#audioElement");
    if (audioElement) {
      if (playing) {
        audioElement.pause();
      } else {
        void audioElement.play();
      }
      setPlaying(!playing);
    }
  };

  return (
    <div>
      <button onClick={togglePlay}>{playing ? <Pause /> : <Play />}</button>
      <audio id="audioElement" src={url} />
    </div>
  );
};
