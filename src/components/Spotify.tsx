import { useAtom, useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/router";
import Chat from "~/components/chat";
import { Button } from "~/components/ui/button";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

const Spotify = () => {
  const router = useRouter();
  const [token, setToken] = useAtom(tokenAtom);
  const code = router.query.code as string;

  const { data } = api.spotify.getToken.useQuery(
    {
      code: code,
    },
    {
      enabled: !!code,
    }
  );

  if (data) {
    setToken(data);
    // void router.push("/");
  }

  if (token) {
    return <Chat />;
  }

  return (
    <Link href="/api/login">
      <Button className="bg-green-500 hover:bg-green-600" type="submit">
        Connect to Spotify
      </Button>
    </Link>
  );
};

export default Spotify;
