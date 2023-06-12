import { Box, VStack } from "@chakra-ui/react";
import Profile from "../../commons/combine/profile";
import CustomTabs from "../../commons/combine/customTabs";
import { useRouter } from "next/router";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  increment,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { db } from "@/src/commons/libraries/firebase/firebase";
import { useRecoilState, useSetRecoilState } from "recoil";
import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import CustomSkeleton from "../../commons/combine/customSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomSpinner from "../../commons/combine/customSpinner";
import EndMessage from "../../commons/combine/endMessage";
import PostItem from "../../commons/combine/postItem";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";
import { getDatabase, ref, push, set, child, get } from "firebase/database";
import { useEffect } from "react";
import { IUser } from "@/src/commons/types/globalTypes";

export default function ProfileDetailContainer() {
  const router = useRouter();
  const { profileId } = router.query;
  const setCurrentHeader = useSetRecoilState(headerState);
  const [currentUser, setCurrentUser] = useRecoilState(userState);

  const toggleIsLikedMutation = useMutation(
    async (postId: string, category: string) => {
      const isLiked = currentUser?.likedPosts?.includes(postId);

      if (isLiked) {
        await updateDoc(doc(collection(db, "users"), currentUser?.uid), {
          likedPosts: arrayRemove(postId),
        });
        await updateDoc(doc(collection(db, "posts"), postId), {
          likeCount: increment(-1),
        });
      } else {
        await updateDoc(doc(collection(db, "users"), currentUser?.uid), {
          likedPosts: arrayUnion(postId),
        });
        await updateDoc(doc(collection(db, "posts"), postId), {
          likeCount: increment(1),
        });
      }

      return { isLiked, postId, category };
    },
    {
      onSuccess: ({ isLiked, postId, category }) => {
        queryClient.setQueryData(["posts"], (prevData: any) => {
          if (prevData) {
            if (isLiked) {
              setCurrentUser((prev: any) => ({
                ...prev,
                likedPosts: prev.likedPosts.filter(
                  (id: string) => id !== postId
                ),
              }));
            } else {
              setCurrentUser((prev: any) => ({
                ...prev,
                likedPosts: [...prev.likedPosts, postId],
              }));
            }
            const updatedData = prevData.pages.flatMap((page) =>
              page.posts.map((post) => {
                if (post.id === postId) {
                  return {
                    ...post,
                    likeCount: post.likeCount + (isLiked ? -1 : 1),
                  };
                }
                return post;
              })
            );

            return {
              ...prevData,
              pages: [{ posts: updatedData }],
            };
          }
          return prevData;
        });
      },

      onError: (error) => {
        console.error(error);
      },
    }
  );

  const toggleLikePost = (postId: string, category: string) => {
    toggleIsLikedMutation.mutate(postId, category);
  };

  const fetchUserProfile = async (profileId: string) => {
    const userDocRef = doc(db, "users", profileId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      setCurrentHeader({
        profileUserName: userDocSnap.data().username,
      });
      const userDataSnapshot = userDocSnap.data();
      userDataSnapshot.id = userDocSnap.id;
      return userDataSnapshot;
    }
    return null;
  };

  const fetchUserPosts = async (profileId: string, startAfterDoc) => {
    const pageSize = 5;
    let q = query(
      collection(db, "posts"),
      where("uid", "==", profileId),
      orderBy("createdAt", "desc")
    );

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    q = query(q, limit(pageSize));

    const postsSnapshot = await getDocs(q);
    const posts = [];

    for (const docSnapshot of postsSnapshot.docs) {
      const postData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      const userDocRef = doc(db, "users", postData.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();
      posts.push({
        ...postData,
        user: userData,
      });
    }

    const lastDoc = postsSnapshot.docs[postsSnapshot.docs.length - 1];
    const hasNextPage = posts.length >= 5;

    return {
      posts,
      lastDoc: hasNextPage ? lastDoc : undefined,
    };
  };

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

  const useUserProfile = (profileId: string) => {
    return useQuery(["userProfile", profileId], () =>
      fetchUserProfile(profileId)
    );
  };

  const useUserPosts = (profileId: string) => {
    return useInfiniteQuery(
      ["posts"],
      ({ pageParam }) => fetchUserPosts(profileId, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.lastDoc,
        keepPreviousData: true,
      }
    );
  };

  const addFriend = (userId: string) => {
    addFriendMutation.mutate(userId);
  };

  const unFriend = (userId: string) => {
    unFriendMutation.mutate(userId);
  };

  const { isLoading: isUserDataLoading, data: userData } =
    useUserProfile(profileId);

  const {
    isLoading: isPostsLoading,
    data: postsData,
    hasNextPage,
    fetchNextPage,
  } = useUserPosts(profileId);

  const postList = postsData?.pages?.flatMap((page) => page.posts) ?? [];

  const createChatRoom = async (friendId) => {
    const chatRoomsRef = ref(getDatabase(), "chatRooms");
    const newChatRoomRef = push(chatRoomsRef);

    const chatRoomData = {
      roomId: newChatRoomRef.key,
      users: [currentUser?.uid, friendId].filter(Boolean), // undefined 또는 falsy 값은 필터링합니다.
    };

    if (chatRoomData.users.length < 2) {
      throw new Error("유효하지 않은 사용자 ID"); // 사용자 ID가 누락되거나 유효하지 않을 경우 에러를 throw합니다.
    }

    await set(newChatRoomRef, chatRoomData);

    // Firestore의 user collection에 chat room ID를 추가
    const userCollectionRef = collection(getFirestore(), "users");
    const currentUserDocRef = doc(userCollectionRef, currentUser?.uid);
    const friendUserDocRef = doc(userCollectionRef, friendId);

    await updateDoc(currentUserDocRef, {
      chatRooms: arrayUnion(newChatRoomRef.key),
    });
    await updateDoc(friendUserDocRef, {
      chatRooms: arrayUnion(newChatRoomRef.key),
    });

    setCurrentUser((prev: any) => ({
      ...prev,
      chatRooms: prev.chatRooms
        ? [...prev.chatRooms, newChatRoomRef.key]
        : [newChatRoomRef.key],
    }));

    return newChatRoomRef.key;
  };

  const moveToChatDetail = async (friendId: string, username: string) => {
    // Firebase Realtime Database의 채팅방 목록 레퍼런스
    const chatRoomsRef = ref(getDatabase(), "chatRooms");

    // 채팅방 생성 또는 이미 존재하는 채팅방 확인
    const createOrFindChatRoom = async () => {
      // 사용자의 UID
      const currentUserUid = currentUser?.uid;

      // 기존 채팅방 목록 조회
      const snapshot = await get(chatRoomsRef);

      // 채팅방을 찾을 때까지 반복
      let existingChatRoomId = null;
      snapshot.forEach((childSnapshot) => {
        const chatRoom = childSnapshot.val();
        // 이미 존재하는 채팅방인지 확인
        if (
          chatRoom.users.includes(currentUserUid) &&
          chatRoom.users.includes(friendId)
        ) {
          existingChatRoomId = childSnapshot.key;
        }
      });

      // 이미 존재하는 채팅방이 있는 경우 해당 채팅방 ID 반환
      if (existingChatRoomId) {
        return existingChatRoomId;
      }

      // 존재하지 않는 경우 새로운 채팅방 생성
      const newChatRoomId = await createChatRoom(friendId);
      return newChatRoomId;
    };

    try {
      setCurrentHeader((prev) => ({
        ...prev,
        chatUserName: username,
        chatUserId: friendId,
        chatUserTown: userData?.town,
      }));

      const roomId = await createOrFindChatRoom(); // 채팅방 생성 또는 기존 채팅방 확인
      router.push(`/chat/${roomId}`); // 해당 채팅방으로 이동하는 페이지로 리다이렉트
    } catch (error) {
      console.log("Error creating or finding chat room:", error);
    }
  };

  return (
    <>
      <Box
        position="sticky"
        top="3.5rem"
        maxHeight="14rem" // 상단 NavLayout의 높이를 제외한 높이
        zIndex={9}
        bgColor="white"
      >
        {isUserDataLoading ? (
          <CustomSkeleton skeletonType="profileDetail" />
        ) : (
          <>
            <Profile
              profileData={userData}
              isMine={false}
              addFriend={addFriend}
              unFriend={unFriend}
              moveToChatDetail={moveToChatDetail}
            />
            <CustomTabs categoryKindOptions="profileCategory" />
          </>
        )}
      </Box>

      {isPostsLoading ? (
        <CustomSkeleton skeletonType="postList" />
      ) : (
        <>
          <InfiniteScroll
            dataLength={postList.length}
            next={fetchNextPage}
            hasMore={hasNextPage ?? false}
            loader={<CustomSpinner spinnerType="postListLoader" />}
            endMessage={<EndMessage />}
          >
            <VStack
              gap="1rem"
              px={{ base: "0px", md: "2px" }}
              mb={{ base: "0", md: "0" }}
            >
              {postList.map((postItemData) => {
                return (
                  <PostItem
                    key={postItemData.id}
                    postItemData={postItemData}
                    toggleLikePost={toggleLikePost}
                  />
                );
              })}
            </VStack>
          </InfiniteScroll>
        </>
      )}
    </>
  );
}
