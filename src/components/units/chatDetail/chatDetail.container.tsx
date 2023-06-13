import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import {
  getDatabase,
  ref,
  get,
  push,
  set,
  onValue,
  off,
} from "firebase/database";
import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import { useRouter } from "next/router";
import { useRecoilState, useSetRecoilState } from "recoil";
import { db } from "@/src/commons/libraries/firebase/firebase";
import { collection, doc, getDoc } from "firebase/firestore";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Text,
  VStack,
  calc,
  useColorModeValue,
} from "@chakra-ui/react";
import SendIcon from "@mui/icons-material/Send";
import PhotoIcon from "@mui/icons-material/Photo";
import Link from "next/link";
import ChatMessage from "../../commons/combine/chatMessage";
import Head from "next/head";
import CustomSpinner from "../../commons/combine/customSpinner";

export default function ChatDetailContainer() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const setCurrentHeader = useSetRecoilState(headerState);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const chatId = router.query.chatId;
  const backgroundColor = useColorModeValue("white", "gray.800");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchUserData = async (uid: string) => {
    const userDocRef = doc(db, "users", uid);
    const userSnapshot = await getDoc(userDocRef);
    const userData = userSnapshot.data();
    if (!userData) return;
    userData.id = uid;
    return userData;
  };

  const fetchChatData = async () => {
    if (!chatId) return [];

    const database = getDatabase();
    const chatRef = ref(database, `chatRooms/${chatId}/users`);
    const snapshot = await get(chatRef);
    const uids = snapshot.val();

    if (!uids || Object.keys(uids).length < 2) {
      return [];
    }

    const otherUserId = Object.values(uids).find(
      (uid) => uid !== currentUser?.uid
    );

    if (otherUserId) {
      // @ts-ignore
      const userData = await fetchUserData(otherUserId);
      // @ts-ignore
      setCurrentHeader((prev) => ({
        ...prev,
        chatUserName: userData?.username,
        chatUserTown: userData?.town,
        chatUserId: otherUserId,
      }));

      return userData;
    }
  };

  const fetchMessages = async () => {
    const messagesRef = ref(getDatabase(), `chatRooms/${chatId}/messages`);
    const snapshot = await get(messagesRef);
    const messagesData = snapshot.val() || {};
    const messagesArray = Object.entries(messagesData).map(([id, message]) => ({
      id,
      // @ts-ignore
      ...message,
    }));

    await setMessages(messagesArray);

    return messagesArray;
  };

  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
  } = useQuery(["userData", chatId], fetchChatData);

  const { data: messagesData, isLoading: isMessagesLoading } = useQuery(
    ["messages", chatId],
    fetchMessages,
    {
      onSuccess: () => {
        scrollToBottom(); // 데이터 로딩이 완료되면 scrollToBottom 함수 호출
      },
    }
  );

  const sendMessage = async () => {
    const messagesRef = ref(getDatabase(), `chatRooms/${chatId}/messages`);
    const newMessageRef = push(messagesRef);

    const messageData = {
      senderId: currentUser?.uid,
      message: newMessage,
      timestamp: new Date().getTime(),
    };

    await set(newMessageRef, messageData);

    setNewMessage("");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (chatId) {
      // 실시간으로 새로운 메시지를 받아오기 위한 구독
      const database = getDatabase();
      const messagesRef = ref(database, `chatRooms/${chatId}/messages`);
      const unsubscribe = onValue(messagesRef, (snapshot) => {
        const messagesData = snapshot.val() || {};
        const messagesArray = Object.entries(messagesData).map(
          ([id, message]) => ({
            id,
            // @ts-ignore
            ...message,
          })
        );

        setMessages(messagesArray); // 메시지 데이터 업데이트
        scrollToBottom();
      });

      return () => {
        off(messagesRef, "value", unsubscribe); // 구독 해제
      };
    }
  }, [chatId]);

  if (isUserLoading && isMessagesLoading) {
    return (
      <>
        <Head>
          <title>Loading...</title>
        </Head>
        <CustomSpinner spinnerType="layout" />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          {
            // @ts-ignore
            userData?.username
          }
        </title>
      </Head>
      <Box
        width="100%"
        h="calc(100vh - 8.1rem)"
        boxShadow={{ base: "none", md: "base" }}
        borderRadius="base"
        // marginTop="0.625rem"
        overflowX="scroll"
      >
        <Flex
          display={{ base: "none", md: "flex" }}
          justifyContent="center"
          alignItems="center"
          width="100%"
          as={Link}
          // @ts-ignore
          href={`/profile/${userData?.id}`}
          gap="0.25rem"
          borderBottom="1px solid #dbdbdb"
          pos="sticky"
          top="0"
          bgColor={backgroundColor}
        >
          <Heading>
            {
              // @ts-ignore
              userData?.username
            }
          </Heading>
          <Text fontSize="1.125rem" color="gray">
            ‧
          </Text>
          <Text fontSize="1.125rem" color="gray">
            {
              // @ts-ignore
              userData?.town
            }
          </Text>
        </Flex>

        {!isMessagesLoading && (
          <VStack w="100%" pb="3rem">
            {messages.map((message) =>
              // @ts-ignore
              message.senderId === currentUser?.uid ? (
                // @ts-ignore
                <ChatMessage
                  isMine={true}
                  // @ts-ignore
                  key={message.id}
                  // @ts-ignore
                  chatMessageData={message}
                />
              ) : (
                <ChatMessage
                  isMine={false}
                  // @ts-ignore
                  key={message.id}
                  // @ts-ignore
                  chatMessageData={message}
                />
              )
            )}
            <div ref={messagesEndRef} />{" "}
            {/* 스크롤을 최하단으로 내리기 위한 빈 div */}
          </VStack>
        )}

        <Flex
          position="fixed"
          bottom="4rem"
          gap="0.75rem"
          px="1rem"
          py="0.75rem"
          width="100%"
          maxW="36.25rem"
          bgColor={backgroundColor}
        >
          <IconButton aria-label="Photo Icon">
            <PhotoIcon />
          </IconButton>
          <Input
            variant="filled"
            fontWeight="semibold"
            color="gray"
            value={newMessage}
            onChange={handleInputChange}
          />
          <IconButton
            aria-label="Send Message"
            onClick={sendMessage}
            isDisabled={!newMessage}
          >
            <SendIcon />
          </IconButton>
        </Flex>
      </Box>
    </>
  );
}
