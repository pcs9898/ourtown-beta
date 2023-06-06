import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  Link as ChakraLink,
  useBreakpointValue,
  useToast,
  LinkOverlay,
} from "@chakra-ui/react";
import {
  ArrowBackIosNew,
  BookmarkBorder,
  KeyboardArrowDown,
  MoreHoriz,
  NotificationsNone,
  Settings,
} from "@mui/icons-material";
import SearchBar from "../../combine/searchBar";
import { useRecoilState, useRecoilValue } from "recoil";
import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import CustomPopover from "../../combine/customPopover";
import { auth } from "@/src/commons/libraries/firebase/firebase";
import { useRouter } from "next/router";
import Link from "next/link";

export default function HeaderLayout() {
  const router = useRouter();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const currentHeader = useRecoilValue(headerState);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const pathname = router.pathname;

  const isHome = pathname === "/";
  const isPostDetail = pathname.startsWith("/posts/");
  const isSearch = pathname === "/search";
  const isDiscover = pathname.startsWith("/discover");
  const isChat = pathname.startsWith("/chat");
  const isMe = pathname === "/me";
  const isProfile = pathname.includes("/me") || pathname.includes("/profile");

  const handleLogout = async () => {
    try {
      await auth.signOut().then(() => {
        setCurrentUser(null);
        router.push("/login");
      });

      toast({
        title: "Success",
        description: "logout",
        status: "success",
        duration: 5000, // Set the desired duration in milliseconds (e.g., 5000 for 5 seconds)
        isClosable: true,
      });
    } catch (error: any) {
      console.log("로그아웃 에러:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000, // Set the desired duration in milliseconds (e.g., 5000 for 5 seconds)
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px="1rem"
      py="0.5rem"
      height="3.5rem"
      bgColor="white"
      position="sticky"
      top={0}
      zIndex={10}
      sx={{
        "@media (max-width: 32.3125rem)": {
          "::-webkit-scrollbar-thumb": {},
          borderBottom:
            router.pathname === "/" || router.pathname === "/search"
              ? "0"
              : "1px solid #dbdbdb",
        },
      }}
    >
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        {!isMobile && (
          <Flex gap="0.75rem">
            <Button variant="ghost" p="0" as={Link} href="/">
              <Image
                src="/logo.svg"
                alt="Logo Image"
                minW="2.5rem"
                h="2.5rem"
              />
            </Button>
            <Button
              size="md"
              colorScheme="teal"
              rightIcon={<KeyboardArrowDown />}
            >
              {currentUser?.city}
            </Button>
          </Flex>
        )}

        {(isSearch || !isMobile) && <SearchBar />}

        {isHome && isMobile && (
          <>
            <Button
              justifySelf="flex-start"
              colorScheme="teal"
              rightIcon={<KeyboardArrowDown />}
            >
              {currentUser?.city}
            </Button>
            <IconButton aria-label="Notification Icon" variant="ghost">
              <NotificationsNone />
            </IconButton>
          </>
        )}
        {isPostDetail && isMobile && (
          <>
            <IconButton
              variant="ghost"
              aria-label="Back Button"
              icon={<ArrowBackIosNew />}
              onClick={() =>
                isMobile && !isPostDetail ? router.push("/") : router.back()
              }
            />
            <Heading
              fontSize="1.25rem"
              textAlign="center"
              position="absolute"
              width="100%"
              left="0"
              right="0"
              margin="auto"
              zIndex="-1"
            >
              {currentHeader?.title}
            </Heading>
          </>
        )}
        {isDiscover && isMobile && (
          <>
            <Heading h="2.5rem">Discover</Heading>{" "}
            <IconButton aria-label="Bookmark Icon" variant="ghost">
              <BookmarkBorder />
            </IconButton>{" "}
          </>
        )}
        {isChat && isMobile && (
          <>
            <Heading h="2.5rem">Chats</Heading>
            <IconButton aria-label="MoreHoriz Icon" variant="ghost">
              <MoreHoriz />
            </IconButton>{" "}
          </>
        )}
        {isProfile && isMobile && (
          <>
            <Heading h="2.5rem">
              {isMe ? currentUser?.username : currentHeader?.profileUserName}
            </Heading>
            <IconButton aria-label="Settings Icon" variant="ghost">
              <Settings />
            </IconButton>
          </>
        )}

        {!isMobile && (
          <Flex gap="0.75rem">
            <CustomPopover isNotifications={true}>hi</CustomPopover>
            <CustomPopover
              isNotifications={false}
              avatarName={currentUser?.username}
            >
              <Button onClick={handleLogout}>로그아웃</Button>
            </CustomPopover>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
