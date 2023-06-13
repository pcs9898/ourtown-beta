import { Box, Button, Flex, VStack, useColorModeValue } from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
  AddOutlined,
  ChatBubbleOutline,
  HomeOutlined,
  MapOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import CustomModal from "../../../combine/customModal";
import CreatePostContainer from "@/src/components/units/createPost/createPost.container";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { headerState } from "@/src/commons/libraries/recoil/recoil";
import { useTranslation } from "react-i18next";

const NavButton = styled(Button)`
  font-size: 1.125rem;
  font-weight: bold;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 0.5rem;
  margin-top: 0px;
`;

NavButton.defaultProps = {
  variant: "ghost",
  sx: { "& > svg": { fontSize: "2rem" } },
  gap: "0.5rem",
  py: "0.5rem",
};

export default function NavLayout() {
  const router = useRouter();
  const pathname = router.pathname;
  const setCurrentHeader = useSetRecoilState(headerState);
  const inactiveIconColor = useColorModeValue("gray.800", "#EEEFF1");
  const activeIconColor = useColorModeValue("teal.500", "teal.200");

  const { t } = useTranslation();

  return (
    <VStack
      as="nav"
      minW="14rem"
      maxW="14rem"
      width="100%"
      display={{ base: "none", md: "flex" }}
      position="sticky"
      top="4.125rem"
      maxHeight="14rem" // 상단 NavLayout의 높이를 제외한 높이
      overflow="auto"
      zIndex={9}
      h="100%"
    >
      <NavButton
        color={
          pathname === "/" || pathname.includes("/posts/")
            ? activeIconColor
            : inactiveIconColor
        }
        as={Link}
        href="/"
      >
        <HomeOutlined />
        {t("pcNavHome")}
      </NavButton>

      <NavButton
        color={
          pathname.startsWith("/discover") ? activeIconColor : inactiveIconColor
        }
        as={Link}
        href="/discover"
      >
        <MapOutlined />
        {t("pcNavDiscover")}
      </NavButton>
      <NavButton
        color={
          pathname.startsWith("/chat") ? activeIconColor : inactiveIconColor
        }
        as={Link}
        href="/chat"
      >
        <ChatBubbleOutline />
        {t("pcNavChats")}
      </NavButton>

      <CustomModal isFixSize={true} isCreatePost={true}>
        <CreatePostContainer />
      </CustomModal>
    </VStack>
  );
}
