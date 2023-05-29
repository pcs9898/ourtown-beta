import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import styled from "@emotion/styled";
import {
  AddOutlined,
  ChatBubbleOutline,
  HomeOutlined,
  MapOutlined,
} from "@mui/icons-material";
import Link from "next/link";

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
    >
      <NavButton color="main">
        <HomeOutlined />
        <Link href="/">Home</Link>
      </NavButton>
      <NavButton>
        <MapOutlined />
        <Link href="/">Discover</Link>
      </NavButton>
      <NavButton>
        <ChatBubbleOutline />
        <Link href="/">Chats</Link>
      </NavButton>
      <Button
        w="100%"
        fontSize="1.125rem"
        leftIcon={<AddOutlined />}
        colorScheme="teal"
      >
        Post
      </Button>
    </VStack>
  );
}
