import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { type ReactElement } from "react";
import Counts from "~/components/Counts";
import CreatePlaylist from "~/components/CreatePlaylist";
import Layout from "~/components/Layout";
import Playlist from "~/components/Playlist";
import Songs from "~/components/Songs";
import Spotify from "~/components/Spotify";
import ChatPage from "~/components/chat/page";
import { formattedAtom, playlistAtom, tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

export default function Page() {
  const formatted = useAtomValue(formattedAtom);
  const token = useAtomValue(tokenAtom);
  const playlist = useAtomValue(playlistAtom);

  const main = {
    initial: {
      opacity: 0,
      y: "-20%",
      // clipPath: "inset(0% 0% 0% 0% round 10px)",
    },
    animate: { opacity: 1, y: "0%" },
    transition: {
      duration: 1,
      type: "tween",

      ease: [0.075, 0.82, 0.165, 1],
      // staggerChildren: 2,
    },
    exit: { opacity: 0, y: "0%" },
  };

  const variant = {
    initial: {
      opacity: 0,
      y: "-20%",
    },
    animate: { opacity: 1, y: "0%" },
    transition: {
      delay: 0.2,
      duration: 1,
      type: "tween",
      ease: [0.075, 0.82, 0.165, 1],
    },
  };

  const buttonVariant = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      delay: 0.4,
      duration: 1,
      type: "spring",
      bounce: 0.6,
      ease: [0.075, 0.82, 0.165, 1],
    },
  };

  const user = api.spotify.getUser.useQuery(
    { token: token?.access_token },
    {
      enabled: !!token.access_token,
      // refetchInterval: false,
      // refetchOnMount: false,
      // refetchOnWindowFocus: false,
      // refetchIntervalInBackground: false,
      keepPreviousData: true,
    }
  );

  if (user.isLoading && token.access_token) return null;

  if (!user?.data?.id) {
    return (
      <motion.div
        className="relative overflow-hidden text-center"
        variants={main}
        initial="initial"
        animate="animate"
        transition={main.transition}
        exit="exit"
      >
        <motion.h1
          className="text-3xl font-bold tracking-tighter sm:text-4xl"
          variants={variant}
          initial="initial"
          animate="animate"
          transition={variant.transition}
        >
          Playlister
        </motion.h1>

        <motion.p
          variants={variant}
          initial="initial"
          animate="animate"
          transition={variant.transition}
          className="mt-2 text-2xl font-semibold tracking-tighter "
        >
          Turn a tracklist into a playlist
        </motion.p>
        <motion.div
          variants={buttonVariant}
          initial="initial"
          animate="animate"
          transition={buttonVariant.transition}
          className="mt-24 flex items-center justify-center "
        >
          <Spotify />
        </motion.div>
      </motion.div>
    );
  }

  if (user.data.id && playlist.url) {
    return (
      <div className=" flex  w-full items-center justify-center ">
        <Playlist />
      </div>
    );
  }

  if (user.data.id && !formatted) {
    return (
      <>
        <ChatPage />
      </>
    );
  }

  if (user.data.id && formatted) {
    return (
      <>
        <div className="mt-60 flex w-full flex-col align-middle  md:mt-24 md:flex-row md:justify-between ">
          <motion.div
            className="mr-auto flex flex-col items-center justify-start gap-4"
            initial={{ opacity: 0, y: "0%" }}
            animate={{ opacity: 1, y: "0%" }}
            transition={{
              duration: 1.0,
              delay: 1.3,
              ease: [0.075, 0.82, 0.165, 1],
            }}
          >
            <Counts />
            <div className="my-4 flex items-center justify-center align-middle md:mt-24">
              <CreatePlaylist userId={user.data.id} />
            </div>
          </motion.div>
          <Songs userId={user?.data?.id} />
        </div>
      </>
    );
  }
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
