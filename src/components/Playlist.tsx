import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { playlistAtom } from "~/store/app";

const Playlist = () => {
  const playlist = useAtomValue(playlistAtom);

  return (
    <motion.div
      initial={{ opacity: 0, y: "20%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{
        duration: 1.5,
        type: "tween",
        ease: [0.075, 0.82, 0.165, 1],
      }}
      exit={{ opacity: 0, y: "0%" }}
    >
      <div className="flex flex-col items-center justify-center gap-2 align-middle">
        <h2 className="text-3xl font-semibold tracking-tight">
          Playlist Created
        </h2>
        <a
          href={playlist.url}
          className="hover:text-green-500"
          rel="noopener noreferrer"
        >
          {playlist.name}
        </a>
      </div>
    </motion.div>
  );
};

export default Playlist;
