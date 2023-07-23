// import NestedLayout from '../components/nested-layout'
import { useAtomValue } from "jotai";
import type { ReactElement } from "react";
import Layout from "~/components/Layout";
import Spotify from "~/components/Spotify";
import Chat from "~/components/chat";
import { tokenAtom } from "~/store/app";

export default function Page() {
  const token = useAtomValue(tokenAtom);

  return (
    <div className="relative isolate  overflow-hidden ">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-zinc  text-3xl font-bold tracking-tight sm:text-4xl">
            Playlister
            <br />
            Create your playlist today.
          </h2>
          {/* <p className='mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300'>
            Incididunt sint fugiat pariatur cupidatat consectetur sit cillum
            anim id veniam aliqua proident excepteur commodo do ea.
          </p> */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {token.access_token ? <Chat /> : <Spotify />}
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
        aria-hidden="true"
      >
        <circle
          cx={512}
          cy={512}
          r={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.7"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#7775D6" />
            <stop offset={1} stopColor="#E935C1" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
