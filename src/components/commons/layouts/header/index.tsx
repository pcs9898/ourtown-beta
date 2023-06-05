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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import CustomPopover from "../../combine/customPopover";
import { auth } from "@/src/commons/libraries/firebase/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import { createIcon } from "@chakra-ui/icons";
import { Icon } from "@chakra-ui/react";

export default function HeaderLayout() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [currentHeader, setCurrentHeader] = useRecoilState(headerState);

  const LogoIcon = createIcon({
    displayName: "LogoIcon",
    viewBox: "0 0 24 24",
    path: (
      <path
        fill="#319795"
        d="M86.834,90.834H33.166c-2.209,0-4-1.791-4-4V61.5c0-1.013,0.384-1.988,1.076-2.729l28.06-30.066l-8.326-9.499   l-32.81,36.819v30.809c0,2.209-1.791,4-4,4s-4-1.791-4-4V54.502c0-0.981,0.361-1.929,1.014-2.661l36.834-41.336   c0.763-0.856,1.816-1.368,3.002-1.339c1.147,0.005,2.236,0.501,2.992,1.363l36.834,42.02c0.64,0.729,0.992,1.667,0.992,2.637   v31.648C90.834,89.043,89.043,90.834,86.834,90.834z M37.166,82.834h45.668V56.69L63.602,34.75L37.166,63.076V82.834z"
      />
    ),
  });

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

  const renderIconByOption = (option: string) => {
    switch (option) {
      case "notification":
        return (
          <IconButton aria-label="Notification Icon" variant="ghost">
            <NotificationsNone />
          </IconButton>
        );
      case "bookmark":
        return (
          <IconButton aria-label="Bookmark Icon" variant="ghost">
            <BookmarkBorder />
          </IconButton>
        );
      case "moreMenu":
        return (
          <IconButton aria-label="MoreHoriz Icon" variant="ghost">
            <MoreHoriz />
          </IconButton>
        );
      case "settings":
        <IconButton aria-label="Settings Icon" variant="ghost">
          <Settings />
        </IconButton>;

      default:
        return null;
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
          borderBottom: router.pathname === "/" ? "0" : "1px solid #dbdbdb",
        },
      }}
    >
      {isMobile && (
        <>
          {currentHeader?.mobileSelectButton && (
            <Button colorScheme="teal" rightIcon={<KeyboardArrowDown />}>
              {currentUser?.city}
            </Button>
          )}
          {currentHeader?.mobileBackButton && (
            <IconButton
              variant="ghost"
              aria-label="Back Button"
              icon={<ArrowBackIosNew />}
              onClick={() => {
                router.back();
                setCurrentHeader({
                  mobileSelectButton: true,
                  mobileRightIcon: "notification",
                });
              }}
            />
          )}
          {currentHeader?.mobileMainTitle && (
            <Heading h="2.5rem">{currentHeader.mobileMainTitle}</Heading>
          )}
          {currentHeader?.mobileSubTitle && (
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
              {currentHeader.mobileSubTitle}
            </Heading>
          )}
          {currentHeader?.mobileRightIcon &&
            renderIconByOption(currentHeader.mobileRightIcon)}

          {currentHeader?.mobileSearchBar && <SearchBar />}
          {/* search deboucing apdated */}
        </>
      )}

      {!isMobile && (
        <Flex w="100%" justifyContent="space-between">
          <Flex gap="0.75rem">
            <Link href="/">
              <Button variant="ghost" p="0">
                <Image
                  src="/logo.svg"
                  alt="Logo Image"
                  minW="2.5rem"
                  h="2.5rem"
                />
              </Button>
            </Link>

            <Button
              w="100%"
              size="md"
              colorScheme="teal"
              rightIcon={<KeyboardArrowDown />}
            >
              {currentUser?.city}
            </Button>
          </Flex>
          <SearchBar />
          <Flex gap="0.75rem">
            <CustomPopover isNotifications={true}>hi</CustomPopover>
            <CustomPopover
              isNotifications={false}
              avatarName={currentUser?.username}
            >
              <Button onClick={handleLogout}>로그아웃</Button>
            </CustomPopover>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
