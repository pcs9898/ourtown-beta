import { Avatar, Box, Flex, Heading, Highlight, Text } from "@chakra-ui/react";

interface IChatItemProps {
  chatItemData: {
    avatarUrl: string;
    username: string;
    town: string;
    time: string;
    chatMessage: string;
  };
}

export default function ChatItem({ chatItemData }: IChatItemProps) {
  const { username, avatarUrl, town, time, chatMessage } = chatItemData;
  return (
    <Flex flexDirection="row" alignItems="center" px="1rem" py="0.75rem">
      <Flex flex="1" gap="0.75rem" alignItems="center">
        <Avatar src={avatarUrl} name={username} />
        {/* 아바타랑 Link(avatarDetail)로  감싸줘야함 */}
        <Box>
          <Flex alignItems="center" gap="0.25rem">
            <Heading size="sm">{username}</Heading>{" "}
            <Text color="subText">{"‧ " + town}</Text>
          </Flex>
          <Text fontSize="1rem">{chatMessage}</Text>
        </Box>
        {/* box chatdetail link로 감싸야함 */}
      </Flex>
      <Text color="subText">
        {time}
        {/* time계산 util적용해야함 */}
      </Text>
    </Flex>
  );
}
