import { useAtomValue } from "jotai";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

type Props = {
  userId: string;
};

const Songs = ({ userId }: Props) => {
  const token = useAtomValue(tokenAtom);

  const songs = api.spotify.getSongs.useQuery(
    { token: token?.access_token, userId },
    {
      enabled: !!token.access_token && !!userId,
    }
  );

  console.log(songs.data);

  return (
    <div>
      <h1>Songs</h1>
    </div>
  );
};

export default Songs;
