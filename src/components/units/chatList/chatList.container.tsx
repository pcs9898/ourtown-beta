import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { getDatabase, ref, onValue, off, get } from "firebase/database";
import { useQuery } from "react-query";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import { db } from "@/src/commons/libraries/firebase/firebase";
import {
  Box,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import ChatItem from "../../commons/combine/chatItem";
import Head from "next/head";
import CustomSpinner from "../../commons/combine/customSpinner";

export default function ChatListContainer() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const backgroundColor = useColorModeValue("white", "gray.800");

  const fetchUserData = async (userId) => {
    const userDocRef = doc(db, "users", userId);
    const userSnapshot = await getDoc(userDocRef);
    const userData = userSnapshot.data();

    return userData;
  };

  const fetchChatroomUsers = async () => {
    const chatroomUsers = [];

    for (const chatroomId of currentUser?.chatRooms) {
      const chatroomRef = ref(getDatabase(), `chatRooms/${chatroomId}`);
      const snapshot = await get(chatroomRef);
      const chatroomData = snapshot.val();

      if (!chatroomData) {
        continue;
      }

      const otherUserId = Object.values(chatroomData.users).find(
        (userId) => userId !== currentUser?.uid
      );

      if (!otherUserId) {
        continue;
      }

      const userData = await fetchUserData(otherUserId);

      // // 가장 최근 객체를 선택합니다.

      if (chatroomData.messages) {
        const sortedObjects = Object.values(chatroomData.messages).sort(
          // @ts-ignore
          (a, b) => b.timestamp - a.timestamp
        );
        const latestObject = sortedObjects[0];
        // @ts-ignore
        userData.lastMessage = latestObject.message;
        // @ts-ignore
        userData.lastMessageTimestamp = latestObject.timestamp;
      }

      // chatroomId를 userData 객체에 추가
      userData.chatroomId = chatroomId;

      chatroomUsers.push(userData);
    }

    return chatroomUsers;
  };

  const { data: chatroomsData, isLoading } = useQuery(
    "chatroomsData",
    fetchChatroomUsers
  );

  if (isLoading) {
    return (
      <>
        <Head>
          <title>Chats</title>
        </Head>
        <CustomSpinner spinnerType="layout" />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Chats</title>
      </Head>
      <Box h="80vh" boxShadow={{ base: 0, md: "base" }}>
        <Flex
          display={{ base: "none", md: "flex" }}
          justifyContent="flex-start"
          alignItems="center"
          width="100%"
          gap="0.25rem"
          pos="sticky"
          top="0"
          px="1rem"
          py="0.75rem"
          bgColor={backgroundColor}
        >
          <Heading>Chats</Heading>
        </Flex>
        <VStack width="100%" spacing={0}>
          {chatroomsData?.map((chatItemData, i) => (
            <ChatItem
              key={chatItemData.chatroomId}
              chatItemData={chatItemData}
            />
          ))}
        </VStack>
      </Box>
    </>
  );
}
