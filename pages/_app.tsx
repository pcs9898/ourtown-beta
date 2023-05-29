import customTheme from "@/src/commons/theme";
import Layouts from "@/src/components/commons/layouts";

import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <Layouts>
        <Component {...pageProps} />
      </Layouts>
    </ChakraProvider>
  );
}
