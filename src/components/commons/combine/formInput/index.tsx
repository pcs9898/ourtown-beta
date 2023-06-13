import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import { Avatar, Button, Flex, FormControl, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

interface IFormInputProps {
  isComment: boolean;
  onSubmit: (data: string) => void;
}

export default function FormInput({ isComment, onSubmit }: IFormInputProps) {
  const currentUser = useRecoilValue(userState);
  const [content, setContent] = useState("");
  const setCurrentHeader = useSetRecoilState(headerState);
  const router = useRouter();

  const { t } = useTranslation();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleFormSubmit = () => {
    onSubmit(content);
    setContent(""); // 폼 제출 후에는 content를 초기화합니다.
  };

  return (
    <FormControl
      display="flex"
      flex="1"
      gap="0.75rem"
      alignItems="center"
      px="1rem"
      py="0.75rem"
    >
      <Avatar
        src={currentUser?.avatarUrl}
        name={currentUser?.username}
        colorScheme="teal"
        onClick={() => {
          setCurrentHeader({
            profileUserName: currentUser?.username,
          });
          router.push(`/me`);
        }}
        cursor="pointer"
      />
      <Input
        variant="filled"
        placeholder={
          isComment
            ? t("formInputaddCommnet") ?? "Add a comment"
            : "Write a review"
        }
        fontWeight="semibold"
        color="gray"
        value={content}
        onChange={handleInputChange}
      />
      <Button colorScheme="teal" flex="none" onClick={handleFormSubmit}>
        {isComment ? t("commentButton") : "Review"}
      </Button>
    </FormControl>
  );
}
