import { ReactNode } from "react";
import FooterLayout from "./footer";
import HeaderLayout from "./header";
import MainLayout from "./main";
import { useRouter } from "next/router";
import { Box, Flex, useTheme } from "@chakra-ui/react";
import { NotificationsNoneOutlined } from "@mui/icons-material";

interface ILayoutsProps {
  children: ReactNode;
}

export default function Layouts({ children }: ILayoutsProps) {
  const { pathname } = useRouter();

  const isLoginSignupLayout = pathname === "/login" || pathname === "/signup";

  return (
    <Box maxW="71.875rem" margin="0 auto">
      {isLoginSignupLayout ? (
        <Box
          as="main"
          justifyContent="center"
          alignItems="center"
          w="100vw"
          h="100vh"
        >
          {children}
        </Box>
      ) : (
        <>
          <HeaderLayout
            city="suwon"
            mobileSelectButton={true}
            mobileRightIcon={<NotificationsNoneOutlined />}
          />
          <MainLayout>{children}</MainLayout>
          <FooterLayout />
        </>
      )}
    </Box>
  );
}
