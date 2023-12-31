import { type AppType } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Layout from "~/components/Layout";
import { ThemeProvider } from "~/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Layout>
        <Component {...pageProps} />
        <Analytics />
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
