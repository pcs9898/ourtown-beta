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
import { AddOutlined, ArrowBackIosNew } from "@mui/icons-material";
import { ReactNode, cloneElement } from "react";

interface ICustomModalProps {
  children: ReactNode;
  modalHeaderTitle: string;
  buttonContent: string;
  isFixSize: boolean;
  createPost?: () => void;
}

export default function CustomModal({
  children,
  isFixSize,
  createPost,
}: ICustomModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const childrenWithProps = cloneElement(children as React.ReactElement, {
    onClose: onClose, // 전달할 props 추가
  });

  return (
    <>
      <Button
        w="100%"
        fontSize="1.125rem"
        leftIcon={<AddOutlined />}
        colorScheme="teal"
        onClick={onOpen}
      >
        Post
      </Button>

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
