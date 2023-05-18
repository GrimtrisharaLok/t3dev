import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toast";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <ThemeProvider attribute="class">
        <Toaster />
        <Component {...pageProps} />
      </ThemeProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
