import { motion } from "framer-motion";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

const Spotify = () => {
  const router = useRouter();
  const setToken = useSetAtom(tokenAtom);
  const code = router.query.code as string;

  const { data } = api.spotify.getToken.useQuery(
    {
      code: code,
    },
    {
      enabled: !!code,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
      // keepPreviousData: true,
    }
  );

  if (data) {
    setToken(data);
    void router.push("/");
  }

  return (
    <Link href="/api/login">
      <motion.div
        whileTap={{ scale: 0.9 }}
        transition={{
          // delay: 1.8,
          // duration: 1,
          type: "spring",
          bounce: 0.6,
          ease: [0.075, 0.82, 0.165, 1],
        }}
      >
        <Button
          className="bg-green-500 font-semibold hover:bg-green-600 dark:bg-green-500 dark:text-white dark:hover:bg-green-600"
          type="submit"
        >
          Connect to Spotify
        </Button>
      </motion.div>
    </Link>
  );
};

export default Spotify;
