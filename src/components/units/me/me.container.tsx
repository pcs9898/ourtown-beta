import { useRecoilState } from "recoil";
import Profile from "../../commons/combine/profile";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import CustomTabs from "../../commons/combine/customTabs";
import {
  FieldPath,
  Firestore,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { useInfiniteQuery, useMutation } from "react-query";
import { db } from "@/src/commons/libraries/firebase/firebase";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";
import CustomSkeleton from "../../commons/combine/customSkeleton";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomSpinner from "../../commons/combine/customSpinner";
import EndMessage from "../../commons/combine/endMessage";
import { Box, VStack } from "@chakra-ui/react";
import PostItem from "../../commons/combine/postItem";
import { useEffect, useState } from "react";

export default function MeContainer() {
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [currentTab, setCurrentTab] = useState("Posts"); // 현재 선택된 탭을 상태로 관리

  const toggleIsLikedMutation = useMutation(
    async (postId: string) => {
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

      return { isLiked, postId };
    },
    {
      onSuccess: ({ isLiked, postId }) => {
        queryClient.setQueryData(["posts", currentTab], (prevData: any) => {
          if (prevData) {
            console.log(prevData);
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

  const toggleLikePost = (postId: string) => {
    toggleIsLikedMutation.mutate(postId);
  };

  const fetchMyLikedPosts = async () => {
    const likedPosts = currentUser?.likedPosts || [];

    const posts = [];
    for (const postId of likedPosts) {
      const postDocRef = doc(db, "posts", postId);
      const postDocSnap = await getDoc(postDocRef);
      if (postDocSnap.exists()) {
        const postData = {
          id: postDocSnap.id,
          ...postDocSnap.data(),
        };
        const userDocRef = doc(db, "users", postData.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = {
            id: userDocSnap.id,
            ...userDocSnap.data(),
          };
          postData.user = userData;
        }
        posts.push(postData);
      }
    }

    posts.sort((a, b) => b.createdAt - a.createdAt);

    return {
      posts,
    };
  };

  const fetchMyPosts = async (startAfterDoc) => {
    const postsRef = collection(db, "posts");

    let q = query(
      postsRef,
      where("uid", "==", currentUser?.uid),
      orderBy("createdAt", "desc")
    );

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    q = query(q, limit(5));

    const querySnapshot = await getDocs(q);
    const posts = [];

    for (const docSnapshot of querySnapshot.docs) {
      const postData = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };

      const userDoc = await getDoc(doc(db, "users", postData.uid));
      const userData = {
        id: userDoc.id,
        ...userDoc.data(),
      };

      posts.push({
        ...postData,
        user: userData,
      });
    }

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    const hasNextPage = posts.length >= 5;

    return {
      posts,
      lastDoc: hasNextPage ? lastDoc : undefined,
    };
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery(
      ["posts", currentTab],
      ({ pageParam }) => {
        if (currentTab === "Posts") {
          return fetchMyPosts(pageParam);
        } else if (currentTab === "Liked") {
          return fetchMyLikedPosts();
        }
        return Promise.resolve([]);
      },
      {
        getNextPageParam: (lastPage) => lastPage.lastDoc,
      }
    );

  const postList =
    currentTab === "Posts"
      ? data?.pages?.flatMap((page) => page.posts) ?? []
      : data?.pages
          ?.flatMap((page) => page.posts)
          .sort((a, b) => b.createdAt - a.createdAt) ?? [];

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollRatio = (scrollTop + clientHeight) / scrollHeight;

    if (scrollRatio >= 0.7 && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  };

  const onClickTab = (tabName: string) => {
    setCurrentTab(tabName);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading, hasNextPage, fetchNextPage]);

  return (
    <>
      <Box
        position="sticky"
        top="3.5rem"
        maxHeight="14rem" // 상단 NavLayout의 높이를 제외한 높이
        zIndex={9}
        bgColor="white"
      >
        <Profile profileData={currentUser} isMine={true} />
        <CustomTabs
          categoryKindOptions="meProfileCategory"
          onClickTab={onClickTab}
        />
      </Box>
      {isLoading ? (
        <CustomSkeleton skeletonType="postList" />
      ) : currentTab !== ("Saved" || "Liked") ? (
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
      ) : (
        <EndMessage />
      )}
    </>
  );
}
