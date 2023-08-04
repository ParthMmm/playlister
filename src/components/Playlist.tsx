import { motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { ChevronLeft } from "lucide-react";
import { formattedAtom, playlistAtom } from "~/store/app";

const Playlist = () => {
  const [playlist, setPlaylist] = useAtom(playlistAtom);
  const setFormatted = useSetAtom(formattedAtom);

  const variant = {
    initial: {
      opacity: 0,
      y: "-20%",
    },
    animate: { opacity: 1, y: "0%" },
    transition: {
      // delay: 1,
      duration: 1,
      type: "tween",
      ease: [0.075, 0.82, 0.165, 1],
    },
  };

  const iconVariant = {
    hover: { opacity: 1, x: 20, color: "#1DB954" },
    initial: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: 0 },
    transition: {
      duration: 0.5,
      type: "spring",
      bounce: 0.6,
      ease: [0.075, 0.82, 0.165, 1],
    },
    iconInitial: { opacity: 0, x: 20 },
  };

  const backToCreate = () => {
    setPlaylist({
      name: "",
      url: "",
    });
    setFormatted(false);
  };

  return (
    <motion.div
      transition={{
        duration: 1,
        type: "tween",
        ease: [0.075, 0.82, 0.165, 1],
      }}
      exit={{ opacity: 0, y: "0%" }}
      className=" h-full w-full"
    >
      <motion.div
        className="absolute left-0 mt-20 flex cursor-pointer  items-center gap-1 align-middle uppercase tracking-tighter"
        whileHover="hover"
        onClick={backToCreate}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.6,
        }}
      >
        <motion.div variants={iconVariant} initial={iconVariant.iconInitial}>
          <ChevronLeft className="h-5 w-5" />
        </motion.div>
        <motion.span
          variants={iconVariant}
          initial={iconVariant.visible}
          whileHover={iconVariant.hover}
        >
          Create Another Playlist
        </motion.span>
      </motion.div>
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 align-middle">
        <motion.h2
          className="text-xl font-medium uppercase tracking-tighter sm:text-xl"
          variants={variant}
          initial="initial"
          animate="animate"
          transition={variant.transition}
        >
          Playlist Created
        </motion.h2>

        <motion.a
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1,
            initialDelay: 0.5,

            bounce: 0.6,
            type: "spring",
            ease: [0.075, 0.82, 0.165, 1],
          }}
          href={playlist.url}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-4xl font-bold uppercase tracking-tight transition-colors hover:text-green-500"
          rel="noopener noreferrer"
        >
          {playlist.name}
        </motion.a>
      </div>
    </motion.div>
  );
};

export default Playlist;
