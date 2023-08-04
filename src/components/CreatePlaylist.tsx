import { motion } from "framer-motion";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createMutation.mutate({
      userId,
      token: token?.access_token,
      removedTracks,
      prompt,
      name,
    });
  };

  //filter

  return (
    <motion.div
      className="flex flex-col gap-4 text-left text-zinc-900 dark:text-white "
      initial={{ opacity: 0, y: "0%" }}
      animate={{ opacity: 1, y: "0%" }}
      transition={{
        duration: 1.0,
        delay: 1,
        ease: [0.075, 0.82, 0.165, 1],
      }}
    >
      <form className="flex flex-col gap-4 text-left" onSubmit={handleSubmit}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Playlist Name"
          required
        />
        <Button
          disabled={createMutation.isLoading}
          variant={"outline"}
          type="submit"
        >
          {createMutation.isLoading ? (
            <Loader2 className="flex h-4 w-8 grow animate-spin" />
          ) : (
            <span>Create Playlist</span>
          )}
        </Button>
      </form>
    </motion.div>
  );
};
export default CreatePlaylist;
