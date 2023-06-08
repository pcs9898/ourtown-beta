import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { AddOutlined, ArrowBackIosNew, Settings } from "@mui/icons-material";
import { ReactNode, cloneElement } from "react";
import { useTranslation } from "react-i18next";

interface ICustomModalProps {
  children: ReactNode;
  isFixSize: boolean;
  isButtonHideMdScreen?: boolean;
  isCreatePost?: boolean;
  isFriendsList?: boolean;
  isEditProfile?: boolean;
  isSettings?: boolean;
  buttonText?: string;
}

export default function CustomModal({
  children,
  isFixSize,
  isButtonHideMdScreen = false,
  isCreatePost,
  isEditProfile,
  isFriendsList,
  isSettings,
  buttonText,
}: ICustomModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation();

  const childrenWithProps = cloneElement(children as React.ReactElement, {
    onClose: onClose, // 전달할 props 추가
  });

  return (
    <>
      {!isButtonHideMdScreen && isCreatePost && (
        <Button
          fontSize="1.125rem"
          leftIcon={<AddOutlined />}
          colorScheme="teal"
          onClick={onOpen}
          position={{ base: "fixed", md: "unset" }}
          bottom="5rem"
          w={{ base: "5.5rem", md: "100%" }}
          float="right"
          right="0.5rem"
        >
          {t("postButton")}
        </Button>
      )}
      {isFriendsList && <Button onClick={onOpen}>{buttonText}</Button>}
      {isEditProfile && (
        <Button onClick={onOpen}>{t("editProfileButton")}</Button>
      )}
      {isSettings && (
        <IconButton
          aria-label="Settings Icon"
          variant="ghost"
          onClick={onOpen}
          display={{ md: "none" }}
        >
          <Settings />
        </IconButton>
      )}
      <Modal isOpen={isOpen} onClose={onClose} motionPreset="none">
        <ModalOverlay />

        <ModalContent
          height={{
            base: "100vh",
          }}
          borderRadius="0"
          maxWidth="36.25rem"
          px="1rem"
          py="0.75rem"
          my={{
            base: "0",
          }}
          sx={{
            "@media (min-width: 32.375rem)": {
              height: isFixSize ? "65vh" : "auto",
              maxHeight: "70%",
              my: "auto",
              borderRadius: "base",
            },
          }}
        >
          {childrenWithProps}
        </ModalContent>
      </Modal>
    </>
  );
}
