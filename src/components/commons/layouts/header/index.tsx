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
  Text,
  useColorModeValue,
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
import CustomModal from "../../combine/customModal";
import SettingsConatiner from "@/src/components/units/settrings";
import { useTranslation } from "react-i18next";
import Profile from "../../combine/profile";
import LogoutIcon from "@mui/icons-material/Logout";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

export default function HeaderLayout() {
  const router = useRouter();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const currentHeader = useRecoilValue(headerState);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const pathname = router.pathname;
  const backgroundColor = useColorModeValue("white", "gray.800");
  const borderBottomColor = useColorModeValue("#dbdbdb", "none");
  const { t } = useTranslation();

  const isHome = pathname === "/";
  const isPostDetail = pathname.startsWith("/posts/");
  const isSearch = pathname === "/search";
  const isDiscover = pathname === "/discover";
  const isChat = pathname === "/chat";
  const isChatDetail = pathname.startsWith("/chat/");
  const isMe = pathname === "/me";
  const isProfile = pathname.includes("/profile");

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
      bgColor={backgroundColor}
      position="fixed"
      top={0}
      zIndex={210}
      w="100%"
      maxW="71.875rem"
      sx={{
        "@media (max-width: 32.3125rem)": {
          "::-webkit-scrollbar-thumb": {},
          borderBottom:
            pathname === "/chat" ? `1px solid ${borderBottomColor}` : "0",
        },
      }}
    >
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        {!isMobile && (
          <Flex gap="0.75rem">
            <Button variant="ghost" p="0" as={Link} href="/" colorScheme="teal">
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
            <Heading fontSize="1.5rem" alignSelf="center">
              {t("mobileHeaderDiscover")}
            </Heading>{" "}
            <IconButton aria-label="Bookmark Icon" variant="ghost">
              <BookmarkBorder />
            </IconButton>{" "}
          </>
        )}
        {isChat && isMobile && (
          <>
            <Heading fontSize="1.5rem" alignSelf="center">
              {t("mobileHeaderChats")}
            </Heading>
            <IconButton aria-label="MoreHoriz Icon" variant="ghost">
              <MoreHoriz />
            </IconButton>{" "}
          </>
        )}

        {isChatDetail && isMobile && (
          <>
            <IconButton
              variant="ghost"
              aria-label="Back Button"
              icon={<ArrowBackIosNew />}
              onClick={() => router.back()}
            />
            <Flex
              textAlign="center"
              justifyContent="center"
              alignItems="center"
              position="absolute"
              width="100%"
              left="0"
              right="0"
              margin="auto"
              zIndex="1"
              as={Link}
              href={`/profile/${currentHeader?.chatUserId}`}
              gap="0.25rem"
            >
              <Heading>{currentHeader?.chatUserName}</Heading>
              <Text fontSize="1.125rem" color="gray">
                ‧
              </Text>
              <Text fontSize="1.125rem" color="gray">
                {currentHeader?.chatUserTown}
              </Text>
            </Flex>
          </>
        )}

        {isMe && isMobile && (
          <>
            <Flex fontSize="1.5rem" gap="0.25rem" alignItems="center">
              <Heading fontSize="1.5rem" alignSelf="center">
                {currentUser?.username}
              </Heading>{" "}
              <Text fontSize="1.5rem" color="gray">
                ‧
              </Text>
              <Text fontSize="1.25rem" color="gray">
                {currentUser?.town}
              </Text>
            </Flex>
          </>
        )}
        {isMe && (
          <CustomModal isFixSize={false} isSettings={true}>
            <SettingsConatiner />
          </CustomModal>
        )}
        {isProfile && isMobile && (
          <>
            <IconButton
              variant="ghost"
              aria-label="Back Button"
              icon={<ArrowBackIosNew />}
              onClick={() => router.back()}
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
              {currentHeader?.profileUserName}`s Profile
            </Heading>
          </>
        )}

        {!isMobile && (
          <Flex gap="0.75rem">
            <CustomPopover isNotifications={true}>hi</CustomPopover>
            <CustomPopover
              isNotifications={false}
              avatarName={currentUser?.username}
              avatarUrl={currentUser?.avatarUrl}
            >
              <Flex flexDir="column" h="100%">
                {currentUser && (
                  <Profile
                    isMine={true}
                    profileData={currentUser}
                    isPcHeaderAvatar={true}
                  />
                )}
                <Flex justifyContent="space-between" px="1rem" pb="0.75rem">
                  <CustomModal isFixSize={false} isPcSettings={true}>
                    <SettingsConatiner />
                  </CustomModal>

                  <IconButton aria-label="Question" variant="ghost">
                    <QuestionMarkIcon />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    aria-label="Log out"
                    onClick={handleLogout}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Flex>
              </Flex>
            </CustomPopover>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
