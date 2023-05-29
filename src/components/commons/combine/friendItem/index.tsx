import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

interface IFriendItemProps {
  friendItemData: {
    avatarUrl: string;
    username: string;
    town: string;
  };
}

export default function FriendItem({ friendItemData }: IFriendItemProps) {
  const { username, avatarUrl, town } = friendItemData;
  return (
    <Flex flexDirection="row" alignItems="center" px="1rem" py="0.75rem">
      <Flex flex="1" gap="0.75rem" alignItems="center">
        <Avatar src={avatarUrl} name={username} />
        <Box>
          <Flex alignItems="center" gap="0.25rem">
            <Heading size="sm">{username}</Heading>{" "}
            <Text color="subText">{"‧ " + town}</Text>
          </Flex>
        </Box>
        {/* avatar, box link(userDetail로 이동) packaging */}
      </Flex>
      <Flex gap="0.5rem">
        <Button colorScheme="teal">Message</Button>
        {/* link(chatDetail) packaging */}
        <Button colorScheme="red">Unfriend</Button>
        {/* unfriend mutation */}
      </Flex>
    </Flex>
  );
}
