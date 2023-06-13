import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import {
  Avatar,
  Box,
  Flex,
  HStack,
  IconButton,
  VStack,
  useColorModeValue,
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
  const backgroundColor = useColorModeValue("white", "gray.800");
  const inactiveIconColor = useColorModeValue("gray.800", "#EEEFF1");
  const activeIconColor = useColorModeValue("teal.500", "teal.200");
  const borderTopColor = useColorModeValue("#dbdbdb", "none");

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
        bgColor={backgroundColor}
        zIndex="sticky"
        borderTop={`1px solid ${borderTopColor}`}
      >
        <IconButton
          icon={<HomeOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Home"
          variant="ghost"
          color={
            pathname === "/" || pathname.includes("/posts/")
              ? activeIconColor
              : inactiveIconColor
          }
          as={Link}
          href="/"
        />

        <IconButton
          icon={<SearchOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Search"
          variant="ghost"
          color={pathname === "/search" ? activeIconColor : inactiveIconColor}
          as={Link}
          href="/search"
        />

        <IconButton
          icon={<MapOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Discover"
          variant="ghost"
          color={
            pathname.startsWith("/discover")
              ? activeIconColor
              : inactiveIconColor
          }
          as={Link}
          href="/discover"
        />

        <IconButton
          icon={<ChatBubbleOutlineOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Messages"
          variant="ghost"
          color={
            pathname.startsWith("/chat") ? activeIconColor : inactiveIconColor
          }
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
