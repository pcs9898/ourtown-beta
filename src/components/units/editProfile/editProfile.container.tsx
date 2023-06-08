import { userState } from "@/src/commons/libraries/recoil/recoil";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Input,
  ModalBody,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { ChangeEvent, useState } from "react";
import { useRecoilState } from "recoil";
import PhotoIcon from "@mui/icons-material/Photo";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app, db } from "@/src/commons/libraries/firebase/firebase";
import { useRouter } from "next/router";
import { collection, doc, updateDoc } from "firebase/firestore";
import { IUser } from "@/src/commons/types/globalTypes";
import { useTranslation } from "react-i18next";

interface IEditProfileContainer {
  onClose?: () => void;
}

export default function EditProfileContainer({
  onClose,
}: IEditProfileContainer) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const onClickSubmit = async () => {
    setIsButtonLoading(true);

    let avatarUrl = "";

    try {
      if (previewImage && selectedFile) {
        // 파일 storage에 이미지 업로드
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);

        // 업로드된 이미지의 다운로드 URL 가져오기
        avatarUrl = await getDownloadURL(storageRef);
      }

      if (username && !previewImage) {
        // 사용자 이름 업데이트
        const userRef = doc(collection(db, "users"), currentUser?.uid);
        await updateDoc(userRef, {
          username: username,
        });
        setCurrentUser(
          (prev) =>
            ({
              ...prev,
              username: username,
            } as IUser | null)
        );
      } else if (!username && previewImage && avatarUrl) {
        // 프로필 이미지 업데이트
        const userRef = doc(collection(db, "users"), currentUser?.uid);
        await updateDoc(userRef, {
          avatarUrl: avatarUrl,
        });
        setCurrentUser(
          (prev) =>
            ({
              ...prev,
              avatarUrl: avatarUrl,
            } as IUser | null)
        );
      } else {
        // 사용자 이름과 프로필 이미지 업데이트
        const userRef = doc(collection(db, "users"), currentUser?.uid);
        await updateDoc(userRef, {
          username: username,
          avatarUrl: avatarUrl,
        });
        setCurrentUser(
          (prev) =>
            ({
              ...prev,
              username: username,
              avatarUrl: avatarUrl,
            } as IUser | null)
        );
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      router.push(`/me`).then(() => {
        if (onClose) onClose();
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsButtonLoading(false);
  };

  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // <input type="file" multiple /> 에서 multiple 속성으로 여러개 드래그 가능
    if (!file) return;

    // 2. 임시URL 생성 => (진짜URL - 다른 브라우저에서도 접근 가능)
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        // 게시판에서 event.target.id 대신 event.currentTarget.id를 썼던 이유: event.target은 태그만을 가르키지 않음
        // 미리보기용
        setPreviewImage(event.target?.result);
        // DB에 넣어주기용
        setSelectedFile(file);
      }
    };
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
            {t("editProfileTitle")}
          </Heading>
          <Button
            colorScheme="teal"
            onClick={onClickSubmit}
            isLoading={isButtonLoading}
            isDisabled={!previewImage && !username}
          >
            {t("saveButton")}
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
        <Flex alignItems="center" gap="0.5rem" mb="1rem">
          <Input
            type="file"
            id="image-upload"
            accept="image/*"
            display="none"
            onChange={onChangeFile}
          />
          <FormLabel htmlFor="image-upload">
            <Avatar
              src={previewImage ? previewImage : currentUser?.avatarUrl}
              name={currentUser?.username}
              boxSize="3.5rem"
              cursor="pointer"
            >
              <AvatarBadge
                w="100%"
                borderRadius="full"
                boxSize="2.2rem"
                bg="blue.500"
                marginRight="0.2rem"
                marginBottom="0.2rem"
              >
                <PhotoIcon />
              </AvatarBadge>
            </Avatar>
          </FormLabel>
          <Heading fontSize={{ base: "1.25rem", md: "1.5rem" }}>
            {currentUser?.username}
          </Heading>
        </Flex>
        <Input
          color="gray"
          placeholder={t("Username") ?? "Username"}
          variant="filled"
          onChange={(e) => setUsername(e.target.value)}
        />
      </ModalBody>
    </>
  );
}
