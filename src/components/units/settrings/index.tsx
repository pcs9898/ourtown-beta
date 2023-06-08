import {
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
} from "@chakra-ui/react";
import { ArrowBackIosNew } from "@mui/icons-material";
import CustomTabs from "../../commons/combine/customTabs";
import { ChangeEvent, useState } from "react";

interface ISettingsConatiner {
  onClose?: () => void;
}

export default function SettingsConatiner({ onClose }: ISettingsConatiner) {
  const [selectedTab, setSelectedTab] = useState("Eng");
  const { colorMode, toggleColorMode } = useColorMode();
  //   const onClickTab = (tabName: string) => {

  //   };

  const onClickTab = (tab: string) => {
    console.log(tab);
  };

  const handleColorModeSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    if (checked) {
      //   toggleColorMode()
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
            Settings
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
            <Heading fontSize="1.125rem">Dark Mode</Heading>
            <Switch
              size="lg"
              colorScheme="teal"
              onChange={toggleColorMode}
              defaultChecked={colorMode === "dark"}
            />
          </Flex>
          <Flex w="100%" justifyContent="space-between" alignItems="center">
            <Heading fontSize="1.125rem">Language</Heading>
            <Tabs display="flex" colorScheme="teal" variant="solid-rounded">
              <Tab borderRadius="base" onClick={() => onClickTab("Eng")}>
                Eng
              </Tab>
              <Tab borderRadius="base" onClick={() => onClickTab("Kor")}>
                Kor
              </Tab>
            </Tabs>
          </Flex>
        </VStack>
      </ModalBody>
    </>
  );
}
