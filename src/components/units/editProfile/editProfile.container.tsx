import { userState } from "@/src/commons/libraries/recoil/recoil";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  ModalBody,
  ModalHeader,
} from "@chakra-ui/react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useState } from "react";
import { useRecoilState } from "recoil";
import PhotoIcon from "@mui/icons-material/Photo";

interface IEditProfileContainer {
  onClose?: () => void;
}

export default function EditProfileContainer({
  onClose,
}: IEditProfileContainer) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [currentUser, setCurrentUser] = useRecoilState(userState);

  const onClickSubmit = () => {};

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
            Edit Profile
          </Heading>
          <Button
            colorScheme="teal"
            onClick={onClickSubmit}
            isLoading={isButtonLoading}
          >
            Save
          </Button>
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
        <Flex alignItems="center" gap="1rem" mb="1rem">
          <Avatar
            src={currentUser?.avatarUrl}
            name={currentUser?.username}
            boxSize="3.5rem"
            overflow="hidden"
          >
            <AvatarBadge
              w="100%"
              border="0"
              borderRadius="0"
              boxSize="2rem"
              bg="blue.500"
            >
              <PhotoIcon />
            </AvatarBadge>
          </Avatar>
          <Heading fontSize={{ base: "1.25rem", md: "1.5rem" }}>
            {currentUser?.username}
          </Heading>
        </Flex>
        <Input placeholder="Username" variant="filled" />
      </ModalBody>
    </>
  );
}

// editprofile마저만들기

// 아바타 사진아이콘쪽 하다맘
