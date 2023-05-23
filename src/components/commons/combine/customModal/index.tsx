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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowBackIos, ArrowBackIosNew } from "@mui/icons-material";
import { ReactNode } from "react";

const modalHeaderTitle = "jo";
const buttonContent = "jo";

interface ICustomModalProps {
  children: ReactNode;
  modalHeaderTitle: string;
  buttonContent: string;
}

export default function CustomModal({
  children,
  modalHeaderTitle,
  buttonContent,
}: ICustomModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={onClose} motionPreset="none">
        <ModalOverlay />
        <ModalContent
          height={{
            base: "100vh",
          }}
          borderRadius={{ base: "0px", md: "base" }}
          maxWidth="32.3125rem"
          px="1rem"
          py="0.75rem"
          my={{
            base: "0",
          }}
          sx={{
            "@media (min-width: 518px)": {
              height: "auto",
              my: "auto",
            },
          }}
        >
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
                fontSize="1.125rem"
                textAlign="center"
                position="absolute"
                width="100%"
                left="0"
                right="0"
                margin="auto"
              >
                {modalHeaderTitle}
              </Heading>
              <Button colorScheme="teal">{buttonContent}</Button>
              {/* mutation link */}
            </Flex>
          </ModalHeader>

          <ModalBody marginTop="0.75rem" p="0">
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
