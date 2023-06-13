import customTheme from "@/src/commons/theme";
import Layouts from "@/src/components/commons/layouts";
import { RecoilEnv } from "recoil";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";
import { config } from "@/src/commons/theme/config.theme";
import { appWithI18Next, useSyncLanguage } from "ni18n";
import { ni18nConfig } from "../ni18n.config";

function App({ Component, pageProps }: AppProps) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;
  const locale =
    typeof window !== "undefined" && window.localStorage.getItem("language");

  useSyncLanguage(locale ? locale : undefined);

  return (
    <ChakraProvider theme={customTheme}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ColorModeScript initialColorMode={config.initialColorMode} />
          <Layouts>
            <Component {...pageProps} />
          </Layouts>
        </QueryClientProvider>
      </RecoilRoot>
    </ChakraProvider>
  );
}

export default appWithI18Next(App, ni18nConfig);
