import { userState } from "@/src/commons/libraries/recoil/recoil";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import CustomModal from "../customModal";
import FriendsListContainer from "@/src/components/units/friendsList/friendsList.container";
import EditProfileContainer from "@/src/components/units/editProfile/editProfile.container";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import Link from "next/link";

interface IProfileProps {
  profileData: {
    avatarUrl?: string;
    username: string;
    town: string;
    friends: string[];
    id?: string;
  };
  isMine?: boolean;
  isPcHeaderAvatar?: boolean;
  addFriend?: (userId: string) => void;
  unFriend?: (userId: string) => void;
  moveToChatDetail?: (userId: string, username: string) => void;
}

export default function Profile({
  profileData,
  isMine,
  addFriend,
  unFriend,
  moveToChatDetail,
  isPcHeaderAvatar = false,
}: IProfileProps) {
  const { avatarUrl, username, town, id } = profileData;
  const currentUser = useRecoilValue(userState);
  const backgroundColor = useColorModeValue("white", "gray.800");
  const { t } = useTranslation();

  return (
    <Flex
      flex="1"
      gap="0.75rem"
      alignItems="center"
      px="1rem"
      // py="0.75rem"
      pb="0.75rem"
      pt={{ base: "0", md: "0.75rem" }}
      position={isPcHeaderAvatar ? "unset" : "sticky"}
      top="3.5rem"
      maxHeight="14rem" // 상단 NavLayout의 높이를 제외한 높이
      zIndex={9}
      bgColor={backgroundColor}
    >
      <Link href="/me">
        <Avatar src={avatarUrl} name={username} boxSize="3.5rem" />
      </Link>
      <Box>
        <Flex
          alignItems="center"
          gap="0.25rem"
          display={{ base: !isMine ? "flex" : "none", md: "flex" }}
        >
          <Heading fontSize={{ base: "1.25rem", md: "1.5rem" }}>
            {username}
          </Heading>
          <Text fontSize="1.25rem" color="gray">
            ‧
          </Text>
          <Text fontSize="1.25rem" color="gray">
            {town}
          </Text>
        </Flex>

        <Flex gap="0.5rem">
          {isMine ? (
            <>
              <CustomModal isFixSize={false} isEditProfile={true}>
                <EditProfileContainer />
              </CustomModal>
              {/* Edit profile Link Packaging */}
              <CustomModal
                isFixSize={false}
                isFriendsList={true}
                buttonText={
                  currentUser?.friends?.length +
                  " " +
                  (currentUser?.friends?.length ?? 0 > 1
                    ? t("friendButton")
                    : t("friendsButton"))
                }
              >
                <FriendsListContainer />
              </CustomModal>

              {/* Friends List Packaging */}
            </>
          ) : (
            <>
              {
                id && currentUser?.friends.includes(id)
                  ? unFriend && (
                      <Button colorScheme="red" onClick={() => unFriend(id)}>
                        {t("unfriendButton")}
                      </Button>
                    )
                  : // unfriend mutation
                    addFriend &&
                    id && (
                      <Button colorScheme="teal" onClick={() => addFriend(id)}>
                        {t("addFriendButton")}
                      </Button>
                    )
                // addFriend mutation
              }
              {moveToChatDetail && id && (
                <Button
                  colorScheme="teal"
                  onClick={() => moveToChatDetail(id, username)}
                >
                  {t("messageButton")}
                </Button>
              )}
            </>
          )}
        </Flex>
      </Box>
    </Flex>
  );
}
