import FormatTimeAgo from "@/src/commons/utils/formatTimgAgo";
import { Box, Flex, Text } from "@chakra-ui/react";

interface IChatMessageProps {
  chatMessageData: {
    message: string;
    timestamp: number;
  };
  isMine: boolean;
}

export default function ChatMessage({
  chatMessageData,
  isMine,
}: IChatMessageProps) {
  const { message, timestamp } = chatMessageData;

  return (
    <Flex
      justify={isMine ? "flex-end" : "flex-start"}
      my="0.25rem"
      px="1rem"
      w="100%"
    >
      {isMine && (
        <Text paddingRight="0.5rem" color="gray" alignSelf="flex-end">
          {FormatTimeAgo(timestamp)}
        </Text>
      )}
      <Box
        p="0.5rem"
        bg={isMine ? "teal.500" : "componentBg"}
        color={isMine ? "white" : "black"}
        borderRadius="md"
      >
        {message}
      </Box>
      {!isMine && (
        <Text paddingLeft="0.5rem" color="gray" alignSelf="flex-end">
          {FormatTimeAgo(timestamp)}
        </Text>
      )}
    </Flex>
  );
}
