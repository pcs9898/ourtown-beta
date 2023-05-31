import { Avatar, Box, Flex, Heading, Highlight, Text } from "@chakra-ui/react";

interface ICommentItemProps {
  commentItemData: {
    username: string;
    content: string;
    avatarUrl: string;
    town: string;
    time: string;
  };
}

export default function CommentItem({ commentItemData }: ICommentItemProps) {
  const { username, content, avatarUrl, town, time } = commentItemData;
  return (
    <Flex
      flexDirection="row"
      flex="1"
      gap="0.75rem"
      alignItems="center"
      px="1rem"
      py="0.75rem"
    >
      <Avatar src={avatarUrl} name={username} />
      <Box>
        <Flex alignItems="center">
          {/* 아바타랑 Flex Link로 감싸줘야함 */}
          <Heading size="sm">{username}</Heading>
          {true && ( // true 자리에 isUserLoggedIn 비교 해서 넣기
            <Highlight
              query="Author"
              styles={{
                bg: "main",
                borderRadius: "base",
                color: "white",
                px: "0.375rem",
                py: "0",
                fontWeight: "semibold",
                marginLeft: "0.25rem",
                fontSize: "0.875rem",
              }}
            >
              Author
            </Highlight>
          )}

          <Text color="subText">{"‧" + town}</Text>
          <Text color="subText">
            {"‧" + time}
            {/* time계산 util적용해야함 */}
          </Text>
        </Flex>
        <Text fontSize="1rem">{content}</Text>
      </Box>
    </Flex>
  );
}
