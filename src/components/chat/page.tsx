import { motion } from "framer-motion";
import { useAtomValue } from "jotai";

import Chat from "~/components/chat";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

const ChatPage = () => {
  const token = useAtomValue(tokenAtom);

  const user = api.spotify.getUser.useQuery(
    { token: token?.access_token },
    {
      enabled: !!token.access_token,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      keepPreviousData: true,
    }
  );

  if (!user.data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{
        duration: 1.5,
        type: "tween",
        ease: [0.075, 0.82, 0.165, 1],
      }}
      exit={{ opacity: 0, y: "0%" }}
    >
      <p className="text-zinc text-3xl font-semibold tracking-tight sm:text-4xl">
        Add your songs below
      </p>
      <p className="mt-4 text-sm text-zinc-900 dark:text-zinc-400">
        Any format should work. <br />
        If you are having issues, try formatting the songs like:
        <br />
        Artist - Track
      </p>
      <div className="mt-10 flex items-center ">
        <div className="flex w-full flex-row justify-center gap-36 align-middle">
          <div className="flex flex-col">
            <Chat userId={user?.data?.id} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default ChatPage;
