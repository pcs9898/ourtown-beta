import { Avatar, Box, Flex, Heading, Text } from "@chakra-ui/react";

interface INotificationItemProps {
  notificationItemData: {
    username: string;
    avatarUrl: string;
    time: string;
  };
}

export default function NotificationItem({
  notificationItemData,
}: INotificationItemProps) {
  const { username, avatarUrl, time } = notificationItemData;
  return (
    <Flex flex="1" gap="0.75rem" alignItems="center" px="1rem" py="0.75rem">
      <Avatar name={username} src={avatarUrl} />
      <Box>
        <Flex gap="0.25rem" alignItems="center">
          <Heading size="sm">{username}</Heading>
          {/* avatar, heading 아바타링크 걸기 */}
          <Text>add a new post</Text>
          {/* 포스트디테일 링크걸기 */}
        </Flex>
        <Text color="subText">{time}</Text>
      </Box>
    </Flex>
  );
}
