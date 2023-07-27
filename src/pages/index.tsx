// import NestedLayout from '../components/nested-layout'
import { useAtomValue } from "jotai";
import { type ReactElement, useState } from "react";
import Counts from "~/components/Counts";
import Layout from "~/components/Layout";
import Songs from "~/components/Songs";
import Spotify from "~/components/Spotify";
import Chat from "~/components/chat";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

export default function Page() {
  const [formatted, setFormatted] = useState(false);
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

  if (!user.data) {
    return (
      <div className="relative isolate  overflow-hidden ">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-zinc  text-3xl font-bold tracking-tight sm:text-4xl">
              Playlister
              <br />
              Create your playlist today.
            </h2>
            <div className="mt-24 flex items-center justify-center ">
              <Spotify />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed isolate overflow-hidden ">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-5xl ">
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
            {user?.data ? (
              <div className="flex w-full flex-row items-start justify-between gap-36 align-middle">
                <div className="flex flex-col">
                  <Chat userId={user?.data?.id} setFormatted={setFormatted} />
                  <Counts formatted={formatted} />
                </div>
                <Songs userId={user?.data?.id} formatted={formatted} />
              </div>
            ) : (
              <Spotify />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
