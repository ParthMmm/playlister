import Image from "next/image";
import { type Item } from "~/server/api/routers/types";

const Track = ({ track }: { track: Item | null }) => {
  if (!track) return null;
  return (
    <div className="flex w-full items-center justify-between rounded-md bg-zinc-800 p-2  ">
      <div className="flex items-center">
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
    </div>
  );
};

export default Track;

import React, { useState } from "react";

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
      <button onClick={togglePlay}>{playing ? "Pause" : "Play"}</button>
      <audio id="audioElement" src={url} />
    </div>
  );
};
