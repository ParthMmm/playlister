import { useAtomValue } from "jotai";
import Track from "~/components/track";
import { type ReturnSong } from "~/server/api/routers/spotify";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

type Props = {
  userId: string;
  formatted: boolean;
};

const Songs = ({ userId, formatted }: Props) => {
  const token = useAtomValue(tokenAtom);

  const songs = api.spotify.getSongs.useQuery(
    { token: token?.access_token, userId },
    {
      enabled: !!token.access_token && !!userId && !!formatted,
    }
  );

  if (songs.isLoading) return <div>Fetching Songs...</div>;

  if (songs.data) {
    return (
      <>
        <div className="flex flex-col items-center justify-center gap-4">
          {songs.data.goodResults.map((song) => (
            <Track track={song?.track} key={song.track?.id} />
          ))}
        </div>
        <div className="flex flex-col items-center justify-center">
          {songs.data.badResults.map((song) => (
            <Track track={song?.track} key={song.track?.id} />
          ))}
        </div>
      </>
    );
  }

  return null;
};

export default Songs;
