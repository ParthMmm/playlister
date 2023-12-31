import { useAtom } from "jotai";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { tokenAtom } from "~/store/app";
import { api } from "~/utils/api";

export default function Page() {
  const router = useRouter();
  const [token, setToken] = useAtom(tokenAtom);
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
    }
  );

  const t = data?.access_token;

  useEffect(() => {
    if (t) {
      setToken(data);
    }
  }, [t, data, setToken]);

  const user = api.spotify.getUser.useQuery(
    { token: token?.access_token },
    {
      enabled: !!token.access_token,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchIntervalInBackground: false,
    }
  );

  if (user.data) {
    void router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="flex h-4 w-8 grow animate-spin " />
    </div>
  );
}
