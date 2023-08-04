import type { ReactNode } from "react";

import Head from "next/head";
import { ModeToggle } from "~/components/theme-toggle";

import { Inter } from "next/font/google";
import { motion } from "framer-motion";

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
          {/* <Nav /> */}
          <div className="relative flex max-h-screen items-center justify-center overflow-hidden px-6 py-24 sm:px-6 sm:py-32 lg:px-8 ">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}

const Nav = () => {
  return (
    <div className="fixed right-0 z-50 mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0,
          type: "tween",
          ease: [0.075, 0.82, 0.165, 1],
        }}
      >
        <ModeToggle />
      </motion.div>
    </div>
  );
};

export default Layout;
