import { db } from "@/src/commons/libraries/firebase/firebase";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import {
  Flex,
  Heading,
  IconButton,
  ModalBody,
  ModalHeader,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowBackIosNew } from "@mui/icons-material";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useMutation, useQuery } from "react-query";
import { useRecoilState } from "recoil";
import FriendItem from "../../commons/combine/friendItem";
import { useTranslation } from "react-i18next";

interface IFriendsListContainer {
  onClose?: () => void;
}

export default function FriendsListContainer({
  onClose,
}: IFriendsListContainer) {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const pxValue = useBreakpointValue({
    base: "100%",
    "32.3125rem": "20vh",
  });
  const { t } = useTranslation();

  const addFriendMutation = useMutation(
    async (uid: string) => {
      try {
        // Add the friend UID to the current user's friends array
        await updateDoc(doc(collection(db, "users"), currentUser?.uid), {
          friends: arrayUnion(uid),
        });

        // Return the updated friend UID
        return uid;
      } catch (error) {
        // Handle error
        throw new Error("Failed to add friend");
      }
    },
    {
      onSuccess: (uid) => {
        // Handle success
        setCurrentUser((prev: any) => ({
          ...prev,
          friends: [...prev.friends, uid],
        }));
      },
      onError: (error) => {
        // Handle error
        console.error(error);
      },
    }
  );

  const unFriendMutation = useMutation(
    async (uid: string) => {
      try {
        // Add the friend UID to the current user's friends array
        await updateDoc(doc(collection(db, "users"), currentUser?.uid), {
          friends: arrayRemove(uid),
        });

        // Return the updated friend UID
        return uid;
      } catch (error) {
        // Handle error
        throw new Error("Failed to add friend");
      }
    },
    {
      onSuccess: (uid) => {
        // Handle success
        setCurrentUser((prev: any) => ({
          ...prev,
          friends: prev.friends.filter((prevId: string) => prevId !== uid),
        }));
      },
      onError: (error) => {
        // Handle error
        console.error(error);
      },
    }
  );

  const fetchFriendsList = async () => {
    try {
      if (!currentUser?.friends) {
        return []; // 또는 다른 적절한 기본값 반환
      }

      const friendsData = [];

      for (const friendUid of currentUser.friends) {
        const userDocRef = doc(db, "users", friendUid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          userData.id = userDocSnapshot.id;
          friendsData.push(userData);
        }
      }

      return friendsData;
    } catch (error) {
      console.error(error);
      throw error; // 에러를 다시 throw하여 상위에서 처리할 수 있도록 전달합니다.
    }
  };

  const addFriend = (userId: string) => {
    addFriendMutation.mutate(userId);
  };

  const unFriend = (userId: string) => {
    unFriendMutation.mutate(userId);
  };

  const { data, isLoading, isError, error } = useQuery("friendsList", () =>
    fetchFriendsList()
  );

  return (
    <>
      <ModalHeader p="0">
        <Flex justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<ArrowBackIosNew />}
            aria-label="Go back"
            onClick={onClose}
            variant="ghost"
            zIndex="1"
          />

          <Heading
            fontSize="1.25rem"
            textAlign="center"
            position="absolute"
            width="100%"
            left="0"
            right="0"
            margin="auto"
          >
            {t("friendsListTitle")}
          </Heading>
        </Flex>
      </ModalHeader>
      <ModalBody
        marginTop="0.75rem"
        overflowY="scroll"
        p="0"
        display="flex"
        flexDir="column"
        sx={{
          "&::-webkit-scrollbar": {
            width: "4px",
            borderRadius: "50px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "50px",
          },
          "@media (min-width: 32.375rem)": {
            height: "auto",
            // maxHeight: "70%",
            // my: "auto",
          },
        }}
      >
        {isLoading ? (
          <h1>loading</h1>
        ) : data?.length === 0 ? (
          <Flex
            justifyContent="center"
            alignItems="center"
            h={{ base: "100%" }}
            sx={{
              "@media (min-width: 32.375rem)": {
                height: "20vh",
              },
            }}
          >
            <Heading size="md">No Friends</Heading>
          </Flex>
        ) : (
          <VStack w="100%">
            {data?.map((friendItemData, _) => (
              <FriendItem
                key={friendItemData.id}
                friendItemData={friendItemData}
                addFriend={addFriend}
                unFriend={unFriend}
              />
            ))}
          </VStack>
        )}
      </ModalBody>
    </>
  );
}
