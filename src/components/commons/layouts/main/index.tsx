import { ReactNode } from "react";
import NavLayout from "./nav";
import SectionLayout from "./section";
import { Box, Flex } from "@chakra-ui/react";

interface IMainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: IMainLayoutProps) {
  return (
    <Flex
      as="main"
      gap="0.625rem"
      px={{ base: 0, md: "0.625rem" }}
      justifyContent={{ base: "center", md: "unset" }}
      minH="15rem"
      h="100%"
    >
      <NavLayout />
      <SectionLayout>{children}</SectionLayout>
    </Flex>
  );
}
