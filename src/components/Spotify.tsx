import { useAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

const Spotify = () => {
  const router = useRouter();
  const [token, setToken] = useAtom(tokenAtom);
  const [clicked, setClicked] = useState(false);
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
    <Link href="/api/login" onClick={() => setClicked(true)}>
      <Button className="bg-green-500 hover:bg-green-600" type="submit">
        Connect to Spotify
      </Button>
    </Link>
  );
};

export default Spotify;
