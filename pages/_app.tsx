import customTheme from "@/src/commons/theme";

import Layouts from "@/src/components/commons/layouts";
import { RecoilEnv } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";

export default function App({ Component, pageProps }: AppProps) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

  return (
    <ChakraProvider theme={customTheme}>
      <RecoilRoot>
        <Layouts>
          <Component {...pageProps} />
        </Layouts>
      </RecoilRoot>
    </ChakraProvider>
  );
}
