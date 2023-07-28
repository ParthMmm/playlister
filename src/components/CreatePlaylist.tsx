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
  );
};
export default CreatePlaylist;
