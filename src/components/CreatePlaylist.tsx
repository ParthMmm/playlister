import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { Button } from "~/components/ui/button";
import { promptAtom, removedTracksAtom, tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const CreatePlaylist = ({ userId }: Props) => {
  const token = useAtomValue(tokenAtom);
  const removedTracks = useAtomValue(removedTracksAtom);
  const createMutation = api.spotify.createPlaylist.useMutation();
  const prompt = useAtomValue(promptAtom);

  //filter

  return (
    <motion.div
      className="flex flex-col text-left text-zinc-900 dark:text-white "
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{
        duration: 1.3,
        delay: 1,
        ease: [0.075, 0.82, 0.165, 1],
      }}
    >
      <Button
        onClick={() =>
          createMutation.mutate({
            userId,
            token: token?.access_token,
            removedTracks,
            prompt,
          })
        }
      >
        Create Playlist
      </Button>
    </motion.div>
  );
};
export default CreatePlaylist;