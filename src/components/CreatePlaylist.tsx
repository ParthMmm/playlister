import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  playingAtom,
  playlistAtom,
  promptAtom,
  removedTracksAtom,
  tokenAtom,
} from "~/store/app";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const CreatePlaylist = ({ userId }: Props) => {
  const token = useAtomValue(tokenAtom);
  const removedTracks = useAtomValue(removedTracksAtom);
  const setPlaylist = useSetAtom(playlistAtom);

  const createMutation = api.spotify.createPlaylist.useMutation({
    onSuccess: (data) => {
      console.log(data);
      if (data) {
        setPlaylist({
          name: data.name,
          url: data.playlistUrl,
        });
      }
    },
  });
  const prompt = useAtomValue(promptAtom);

  const [name, setName] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  //filter

  return (
    <motion.div
      className="flex flex-col gap-2 text-left text-zinc-900 dark:text-white "
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{
        duration: 1.0,
        delay: 1,
        ease: [0.075, 0.82, 0.165, 1],
      }}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist Name"
      />
      <Button
        onClick={() =>
          createMutation.mutate({
            userId,
            token: token?.access_token,
            removedTracks,
            prompt,
            name,
          })
        }
        disabled={createMutation.isLoading}
      >
        {createMutation.isLoading ? (
          <Loader2 className="flex h-4 w-8 grow animate-spin" />
        ) : (
          <span>Create Playlist</span>
        )}
      </Button>
    </motion.div>
  );
};
export default CreatePlaylist;
