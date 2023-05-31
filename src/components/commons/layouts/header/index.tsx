import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import {
  ArrowBackIosNew,
  KeyboardArrowDown,
  NotificationsNone,
} from "@mui/icons-material";
import SearchBar from "../../combine/searchBar";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import CustomPopover from "../../combine/customPopover";
import { auth } from "@/src/commons/libraries/firebase/firebase";
import { useRouter } from "next/router";

interface IHeaderLayoutProps {
  city: string;
  mobileSelectButton?: boolean;
  mobileRightIcon?: React.ReactElement;
  mobileRightIconArialabel?: string;
  mobileBackButton?: boolean;
  mobileMainTitle?: string;
  mobileSubTitle?: React.ReactElement | string;
  mobileSearchBar?: boolean;
}

export default function HeaderLayout({
  city,
  mobileSelectButton,
  mobileRightIcon,
  mobileRightIconArialabel = "Icon Button",
  mobileBackButton,
  mobileMainTitle,
  mobileSubTitle,
  mobileSearchBar,
}: IHeaderLayoutProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();
  const toast = useToast();
  const [currentUser, setCurrentUser] = useRecoilState(userState);

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
    >
      {isMobile && (
        <>
          {mobileSelectButton && (
            <Button colorScheme="teal" rightIcon={<KeyboardArrowDown />}>
              {currentUser?.city}
            </Button>
          )}
          {mobileBackButton && (
            <IconButton
              variant="ghost"
              aria-label="Back Button"
              icon={<ArrowBackIosNew />}
            />
          )}
          {/* go back routing add */}
          {mobileMainTitle && <Heading h="2.5rem">{mobileMainTitle}</Heading>}
          {mobileSubTitle && (
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
              {mobileSubTitle}
            </Heading>
          )}
          {mobileRightIcon && (
            <IconButton variant="ghost" aria-label={mobileRightIconArialabel}>
              {mobileRightIcon}
            </IconButton>
          )}
          {mobileSearchBar && <SearchBar city={city} />}
          {/* search deboucing apdated */}
        </>
      )}

      {!isMobile && (
        <Flex w="100%" justifyContent="space-between">
          <Flex gap="0.75rem">
            <Image src="/logo.svg" alt="Logo Image" w="2.5rem" h="2.5rem" />
            <Button
              w="100%"
              size="md"
              colorScheme="teal"
              rightIcon={<KeyboardArrowDown />}
            >
              {currentUser?.city}
            </Button>
          </Flex>
          <SearchBar city={currentUser?.city || ""} />
          <Flex gap="0.75rem">
            <IconButton aria-label="Notification Icon" variant="ghost">
              <NotificationsNone />
            </IconButton>
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
