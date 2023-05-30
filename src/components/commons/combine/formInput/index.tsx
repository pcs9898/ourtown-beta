import { Avatar, Button, Flex, FormControl, Input } from "@chakra-ui/react";

interface IFormInputProps {
  isComment: boolean;
}

export default function FormInput({ isComment }: IFormInputProps) {
  //isUserLoggedIn 으로 현재 로그인 한 유저 프로필 불러오기
  const username = "Park Chansoo";
  const avatarUrl = "";

  //댓글 등록하기
  const handleCommentSubmit = () => {
    console.log("hi");
  };

  //write a review
  const handleReviewSubmit = () => {
    console.log("hi");
  };

  return (
    <FormControl
      flex="1"
      gap="0.75rem"
      alignItems="center"
      px="1rem"
      py="0.75rem"
    >
      <Avatar src={avatarUrl} name={username} />
      <Input
        variant="filled"
        placeholder={isComment ? "Add a comment" : "Write a review"}
        fontWeight="semibold"
      />
      <Button
        colorScheme="teal"
        flex="none"
        onClick={isComment ? handleCommentSubmit : handleReviewSubmit}
      >
        {isComment ? "Comment" : "Review"}
      </Button>
    </FormControl>
  );
}
