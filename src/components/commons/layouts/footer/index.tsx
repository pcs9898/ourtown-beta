import { Box, Flex, HStack, IconButton, VStack } from "@chakra-ui/react";
import {
  AccountCircleOutlined,
  ChatBubbleOutlineOutlined,
  HomeOutlined,
  MapOutlined,
  SearchOutlined,
} from "@mui/icons-material";

export default function FooterLayout() {
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
        />
        <IconButton
          icon={<SearchOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Search"
          variant="ghost"
        />
        <IconButton
          icon={<MapOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Notifications"
          variant="ghost"
        />
        <IconButton
          icon={<ChatBubbleOutlineOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Messages"
          variant="ghost"
        />
        <IconButton
          icon={<AccountCircleOutlined style={{ fontSize: "2rem" }} />}
          aria-label="Profile"
          variant="ghost"
        />
      </Flex>
    </Box>
  );
}
