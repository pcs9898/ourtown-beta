import { Inter } from "next/font/google";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  Select,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import CommentItem from "@/src/components/commons/combine/commentItem";
import AddCommentOrReview from "@/src/components/commons/combine/formInput";
import PostItem from "@/src/components/commons/combine/postItem";
import PostDetail from "@/src/components/commons/combine/postDetatil";
import NotificationItem from "@/src/components/commons/combine/notificationItem";
import DiscoverItem from "@/src/components/commons/combine/discoverItem";
import DiscoverCard from "@/src/components/commons/combine/discoverCard";
import DiscoverDetail from "@/src/components/commons/combine/discoverDetail";
import ChatItem from "@/src/components/commons/combine/chatItem";
import ChatMessage from "@/src/components/commons/combine/chatMessage";
import FriendItem from "@/src/components/commons/combine/friendItem";
import Profile from "@/src/components/commons/combine/profile";
import CustomTabs from "@/src/components/commons/combine/customTabs";
import CustomModal from "@/src/components/commons/combine/customModal";
import CustomPopover from "@/src/components/commons/combine/customPopover";
import Header from "@/src/components/commons/layouts/header";
import { NotificationsNone } from "@mui/icons-material";
const inter = Inter({ subsets: ["latin"] });

const exam = {
  username: "John Doe",
  content: "This is a comment.",
  avatarUrl: "",
  town: "교동",
  time: "지금",
};

const data = {
  town: "gyodong",
  time: "1h",
  likeCount: 12,
  commentCount: 5,
  contents:
    "With Chakra UI, I wanted to sync the speed of development with thespeed of design. I wanted the developer to be just as excited as thedesigner to create a screen.",
  imgUrl:
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
  avatarUrl: "https://naver.com",
  username: "Chan Pa",
  isLiked: true,
};

const data2 = {
  avatarUrl: "Hello how are you?",
  username: "Chansoo Park",
  town: "suwon",
  isFriend: true,
  friendsCount: 5,
};

export default function Home() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <CustomTabs
      tabList={[
        "posts",
        "Liked",
        "interested",
        "interested",
        "interested",
        "interested",
        "posts",

        "interested",
      ]}
    >
      <Stack gap="0.5rem" marginTop="2px">
        {Array.from({ length: 9 }, (_, index) => (
          <PostDetail key={index} postDetailData={data} />
        ))}
      </Stack>
    </CustomTabs>
  );
}
