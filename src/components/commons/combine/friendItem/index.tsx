import { userState } from "@/src/commons/libraries/recoil/recoil";
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

interface IFriendItemProps {
  friendItemData: {
    id: string;
    avatarUrl: string;
    username: string;
    town: string;
  };
  addFriend: (userId: string) => void;
  unFriend: (userId: string) => void;
}

export default function FriendItem({
  friendItemData,
  addFriend,
  unFriend,
}: IFriendItemProps) {
  const { username, avatarUrl, town, id } = friendItemData;
  const currentUser = useRecoilValue(userState);
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Flex flexDirection="row" alignItems="center" py="0.75rem" w="100%">
      <Flex flex="1" gap="0.75rem" alignItems="center">
        <Avatar
          src={avatarUrl}
          name={username}
          onClick={() => router.push(`/profile/${id}`)}
          cursor="pointer"
        />
        <Box>
          <Flex alignItems="center" gap="0.25rem">
            <Heading
              size="sm"
              cursor="pointer"
              onClick={() => router.push(`/profile/${id}`)}
            >
              {username}
            </Heading>{" "}
            <Text color="gray" fontSize="1rem">
              {"‧ " + town}
            </Text>
          </Flex>
        </Box>
        {/* avatar, box link(userDetail로 이동) packaging */}
      </Flex>
      <Flex gap="0.5rem">
        <Button colorScheme="teal">{t("messageButton")}</Button>
        {/* link(chatDetail) packaging */}
        {currentUser?.friends.includes(id) ? (
          <Button colorScheme="red" onClick={() => unFriend(id)}>
            {t("unfriendButton")}
          </Button>
        ) : (
          // unfriend mutation
          <Button colorScheme="teal" onClick={() => addFriend(id)}>
            {t("addFriendButton")}
          </Button>
          // addFriend mutation
        )}
        {/* unfriend mutation */}
      </Flex>
    </Flex>
  );
}
