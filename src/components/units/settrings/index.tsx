import { auth } from "@/src/commons/libraries/firebase/firebase";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  ModalBody,
  ModalHeader,
  Switch,
  Tab,
  Tabs,
  VStack,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

interface ISettingsConatiner {
  onClose?: () => void;
}

export default function SettingsConatiner({ onClose }: ISettingsConatiner) {
  const [selectedTab, setSelectedTab] = useState("Eng");
  const { colorMode, toggleColorMode } = useColorMode();
  const { t, i18n } = useTranslation();
  const setCurrentUser = useSetRecoilState(userState);
  const router = useRouter();
  const toast = useToast();

  const onClickTab = (tab: string) => {
    i18n.changeLanguage(tab).then(() => localStorage.setItem("language", tab));
  };

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
    <>
      <ModalHeader p="0">
        <Flex justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<ArrowBackIosNew />}
            aria-label="Go back"
            onClick={onClose}
            variant="ghost"
            zIndex="1"
          />

          <Heading
            fontSize="1.25rem"
            textAlign="center"
            position="absolute"
            width="100%"
            left="0"
            right="0"
            margin="auto"
          >
            {t("settingsTitle")}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalBody
        marginTop="0.75rem"
        overflowY="scroll"
        p="0"
        display="flex"
        flexDir="column"
        sx={{
          "&::-webkit-scrollbar": {
            width: "4px",
            borderRadius: "50px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "50px",
          },
          "@media (min-width: 32.375rem)": {
            height: "auto",
            // maxHeight: "70%",
            // my: "auto",
          },
        }}
      >
        <VStack>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Heading fontSize="1.125rem">{t("darkmodeMenu")}</Heading>
            <Switch
              size="lg"
              colorScheme="teal"
              onChange={toggleColorMode}
              defaultChecked={colorMode === "dark"}
            />
          </Flex>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Heading fontSize="1.125rem">{t("languagueMenu")}</Heading>
            <Tabs
              defaultIndex={i18n.language === "en" ? 0 : 1}
              display="flex"
              colorScheme="teal"
              variant="solid-rounded"
            >
              <Tab borderRadius="base" onClick={() => onClickTab("en")}>
                {t("languagueMenu1")}
              </Tab>
              <Tab borderRadius="base" onClick={() => onClickTab("ko")}>
                {t("languagueMenu2")}
              </Tab>
            </Tabs>
          </Flex>
          <Button mt="6rem" colorScheme="red" onClick={handleLogout}>
            Log out
          </Button>
        </VStack>
      </ModalBody>
    </>
  );
}
