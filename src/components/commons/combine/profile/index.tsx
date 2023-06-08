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

interface IProfileProps {
  profileData: {
    avatarUrl: string;
    username: string;
    town: string;
    friends: string[];
    id: string;
  };
  isMine?: boolean;
  addFriend: (userId: string) => void;
  unFriend: (userId: string) => void;
}

export default function Profile({
  profileData,
  isMine,
  addFriend,
  unFriend,
}: IProfileProps) {
  const { avatarUrl, username, town, friends, id } = profileData;
  const currentUser = useRecoilValue(userState);
  const backgroundColor = useColorModeValue("white", "gray.800");

  return (
    <Flex
      flex="1"
      gap="0.75rem"
      alignItems="center"
      px="1rem"
      // py="0.75rem"
      pb="0.75rem"
      pt={{ base: "0", md: "0.75rem" }}
      position="sticky"
      top="3.5rem"
      maxHeight="14rem" // 상단 NavLayout의 높이를 제외한 높이
      zIndex={9}
      bgColor={backgroundColor}
    >
      <Avatar src={avatarUrl} name={username} boxSize="3.5rem" />
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
                  friends.length + (friends.length > 1 ? " friends" : " friend")
                }
              >
                <FriendsListContainer />
              </CustomModal>

              {/* Friends List Packaging */}
            </>
          ) : (
            <>
              {currentUser?.friends.includes(id) ? (
                <Button colorScheme="red" onClick={() => unFriend(id)}>
                  UnFriend
                </Button>
              ) : (
                // unfriend mutation
                <Button colorScheme="teal" onClick={() => addFriend(id)}>
                  Add Friend
                </Button>
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
