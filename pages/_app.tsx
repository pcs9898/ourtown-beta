import customTheme from "@/src/commons/theme";
import Layouts from "@/src/components/commons/layouts";
import { RecoilEnv } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { QueryClient, QueryClientProvider } from "react-query";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";

export default function App({ Component, pageProps }: AppProps) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

  return (
    <ChakraProvider theme={customTheme}>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Layouts>
            <Component {...pageProps} />
          </Layouts>
        </QueryClientProvider>
      </RecoilRoot>
    </ChakraProvider>
  );
}
