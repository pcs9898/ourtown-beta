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

  const hideHeaderLayout = pathname === "/signin" || pathname === "/signup";

  return (
    <Box maxW="71.875rem" margin="0 auto">
      {hideHeaderLayout ? null : (
        <>
          <HeaderLayout
            city="suwon"
            mobileSelectButton={true}
            mobileRightIcon={<NotificationsNoneOutlined />}
          />
        </>
      )}
      <MainLayout>{children}</MainLayout>
      <FooterLayout />
    </Box>
  );
}
