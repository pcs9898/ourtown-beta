import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  VStack,
} from "@chakra-ui/react";
import {
  AccountCircleOutlined,
  ChatBubbleOutlineOutlined,
  HomeOutlined,
  MapOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";

export default function FooterLayout() {
  const router = useRouter();
  const pathname = router.pathname;
  const currentUser = useRecoilValue(userState);

  return (
    <Box as="footer" display={{ md: "none" }}>
      <Flex
        as="nav"
        align="center"
        justify="space-around"
        pos="fixed"
        bottom="0"
        left="0"
        right="0"
        height="4rem"
        bg="white"
        zIndex="sticky"
        borderTop="1px solid #dbdbdb"
      >
        <IconButton
          icon={<HomeOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Home"
          variant="ghost"
          color={
            pathname === "/" || pathname.includes("/posts/") ? "teal" : "black"
          }
          as={Link}
          href="/"
        />

        <IconButton
          icon={<SearchOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Search"
          variant="ghost"
          color={pathname === "/search" ? "teal" : "black"}
          as={Link}
          href="/search"
        />

        <IconButton
          icon={<MapOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Discover"
          variant="ghost"
          color={pathname.startsWith("/discover") ? "teal" : "black"}
          as={Link}
          href="/discover"
        />

        <IconButton
          icon={<ChatBubbleOutlineOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Messages"
          variant="ghost"
          color={pathname.startsWith("/chat") ? "teal" : "black"}
          as={Link}
          href="/chat"
        />

        <Avatar
          src={currentUser?.avatarUrl}
          name={currentUser?.username}
          boxSize="2rem"
          as={Link}
          href="/me"
        />
      </Flex>
    </Box>
  );
}
