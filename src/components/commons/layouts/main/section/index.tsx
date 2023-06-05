import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface ISectionLayoutProps {
  children: ReactNode;
}

export default function SectionLayout({ children }: ISectionLayoutProps) {
  const { pathname } = useRouter();

  const isWideSection = pathname === "/discover" || pathname === "/chat";

  return (
    <Box
      flex="1"
      as="section"
      w="36.25rem"
      maxW={isWideSection ? "none" : "36.25rem"}
      minW="20rem"
    >
      {children}
    </Box>
  );
}
