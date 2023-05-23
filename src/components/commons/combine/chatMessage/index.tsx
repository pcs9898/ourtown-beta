import { Box, Flex, Text } from "@chakra-ui/react";

interface IChatMessageProps {
  chatMessageData: {
    content: string;
    time: string;
    isMine: boolean;
  };
}

export default function ChatMessage({ chatMessageData }: IChatMessageProps) {
  const { content, time, isMine } = chatMessageData;

  return (
    <Flex justify={isMine ? "flex-end" : "flex-start"} my="0.5rem" mx="1rem">
      {isMine && (
        <Text paddingRight="0.5rem" color="subText" alignSelf="flex-end">
          {time}
        </Text>
      )}
      <Box
        p="0.5rem"
        bg={isMine ? "teal.500" : "componentBg"}
        color={isMine ? "white" : "black"}
        borderRadius="md"
      >
        {content}
      </Box>
      {!isMine && (
        <Text paddingLeft="0.5rem" color="subText" alignSelf="flex-end">
          {time}
        </Text>
      )}
    </Flex>
  );
}
