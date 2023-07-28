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

  if (user.isLoading) return null;

  if (!user?.data?.id) {
    return (
      <>
        <h2 className="  text-3xl font-bold tracking-tight sm:text-4xl">
          Playlister
          <br />
          Create your playlist today.
        </h2>
        <div className="mt-24 flex items-center justify-center ">
          <Spotify />
        </div>
      </>
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
        <div className="gap-18 flex w-full flex-col align-middle md:flex-row md:justify-between md:gap-36 ">
          <div className="mr-auto flex flex-col justify-start gap-4">
            <Counts />
            <CreatePlaylist userId={user.data.id} />
          </div>
          <Songs userId={user?.data?.id} />
        </div>
      </>
    );
  }
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
