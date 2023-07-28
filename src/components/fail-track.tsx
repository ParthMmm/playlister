import { type ReturnSong } from "~/server/api/routers/spotify";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";

const FailTrack = ({ track }: { track: ReturnSong }) => {
  if (!track) return null;
  return (
    <motion.div
      className="group relative ml-0 mr-6 w-full md:ml-6 md:mr-0"
      // variants={container}
      // initial="initial"
      // whileHover="whileHover"
    >
      <div
        className={cn(
          "flex h-20 flex-row items-center justify-between overflow-hidden rounded-lg border-2  border-zinc-200 bg-transparent p-4 align-middle text-zinc-900 shadow-md transition-colors dark:border-zinc-700 dark:text-white "
        )}
      >
        <div className="flex items-center ">
          <div
            className="flex flex-col flex-wrap items-start 
          justify-start px-1
          text-left "
          >
            <div className="text-base font-medium ">{track.song}</div>
            <div className="text-xs font-bold ">{track.artist}</div>
          </div>
        </div>
        <div className="invisible group-hover:visible"></div>
      </div>
    </motion.div>
  );
};

export default FailTrack;
