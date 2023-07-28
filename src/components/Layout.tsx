import type { ReactNode } from "react";

import Head from "next/head";
import { ModeToggle } from "~/components/theme-toggle";

import { Inter } from "next/font/google";

type Props = {
  children: ReactNode;
};

const inter = Inter({ subsets: ["latin"] });

function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <title>playlister</title>
        <meta name="description" content="playlister " />
        <meta property="og:title" content="playlister" />
        <meta property="og:description" content="playlister" />
        {/* <meta property="og:image" content="https://auriom.club/api/og" /> */}
      </Head>
      <main className={inter.className}>
        <div className=" no-scrollbar mx-auto max-h-screen min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8 ">
          <Nav />
          <div className="relative max-h-screen overflow-hidden px-6 py-24 sm:px-6 sm:py-32 lg:px-8 ">
            <div className="mx-auto  text-center">{children}</div>
          </div>
        </div>
      </main>
    </>
  );
}

const Nav = () => {
  return (
    <div className="fixed mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex  items-center justify-between">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Layout;
