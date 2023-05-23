import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Highlight,
  Text,
} from "@chakra-ui/react";

interface IProfileProps {
  profileData: {
    avatarUrl: string;
    username: string;
    town: string;
    isFriend: boolean;
    friendsCount: number;
  };
}

export default function Profile({ profileData }: IProfileProps) {
  const { username, avatarUrl, town, isFriend, friendsCount } = profileData;
  const isMine = true; //isUserLoggedIn으로 체크하는 로직 필요

  return (
    <Flex flex="1" gap="0.75rem" alignItems="center" px="1rem" py="0.75rem">
      <Avatar src={avatarUrl} name={username} size="lg" />
      <Box>
        <Flex alignItems="center" gap="0.25rem">
          <Heading size="lg">{username}</Heading>{" "}
          <Text fontSize="1.5rem" color="subText">
            {"‧ " + town}
          </Text>
        </Flex>
        <Flex gap="0.5rem">
          {isMine ? (
            <>
              <Button>Edit Profile</Button>
              {/* Edit profile Link Packaging */}
              <Button>
                {friendsCount + (friendsCount > 1 ? " friends" : " friend")}
              </Button>
              {/* Friends List Packaging */}
            </>
          ) : (
            <>
              {isFriend ? (
                <Button colorScheme="red">UnFriend</Button>
              ) : (
                // unfriend mutation
                <Button colorScheme="teal">Add Friend</Button>
                // addFriend mutation
              )}
              <Button colorScheme="teal">Message</Button>
              {/* chatDetail Link packaging */}
            </>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
