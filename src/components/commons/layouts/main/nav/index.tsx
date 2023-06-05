import { Box, Button, Flex, VStack } from "@chakra-ui/react";
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
        as={Link}
        href="/"
        color={
          pathname === "/" || pathname.includes("/posts/") ? "teal" : "black"
        }
      >
        <HomeOutlined />
        Home
      </NavButton>

      <NavButton
        as={Link}
        href="/discover"
        color={pathname.startsWith("/discover") ? "teal" : "black"}
      >
        <MapOutlined />
        Discover
      </NavButton>
      <NavButton
        as={Link}
        href="/chat"
        color={pathname.startsWith("/chat") ? "teal" : "black"}
      >
        <ChatBubbleOutline />
        Chats
      </NavButton>

      <CustomModal buttonContent="Post" isFixSize={true}>
        <CreatePostContainer />
      </CustomModal>
    </VStack>
  );
}
