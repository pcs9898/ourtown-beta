import { useRecoilState } from "recoil";
import CustomTabs from "../../commons/combine/customTabs";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import React, { useEffect, useState } from "react";
import {
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
import { db } from "@/src/commons/libraries/firebase/firebase";
import { useMutation, useInfiniteQuery } from "react-query";
import PostItem from "../../commons/combine/postItem";
import { Box, Spinner, VStack, useMediaQuery } from "@chakra-ui/react";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";
import CustomModal from "../../commons/combine/customModal";
import CreatePostContainer from "../createPost/createPost.container";
import InfiniteScroll from "react-infinite-scroll-component";
import CustomSkeleton from "../../commons/combine/customSkeleton";
import CustomSpinner from "../../commons/combine/customSpinner";
import EndMessage from "../../commons/combine/endMessage";

function PostListContainer() {
  const [category, setCategory] = useState("Daily");
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [isMdScreen] = useMediaQuery("(min-width: 48em)");
  const defaultCategory = "Daily";

  useEffect(() => {}, []);

  const onClickTab = async (newCategory: string) => {
    if (category !== newCategory) {
      setCategory(newCategory);
    }
  };

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
        queryClient.setQueryData(["posts", category], (prevData: any) => {
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

  const toggleLikePost = (postId: string) => {
    toggleIsLikedMutation.mutate(postId);
  };

  const fetchPostsByCategory = async (category: string, startAfterDoc) => {
    const postsRef = collection(db, "posts");
    let q = query(
      collection(db, "posts"),
      where("category", "==", category),
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

    // 포스트가 4개 미만인 경우에는 더 이상의 페이지가 없음을 알림
    const hasNextPage = posts.length >= 5;

    return {
      posts,
      lastDoc: hasNextPage ? lastDoc : undefined,
    };
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError } =
    useInfiniteQuery(
      ["posts", category],
      ({ pageParam }) => fetchPostsByCategory(category, pageParam),
      {
        getNextPageParam: (lastPage) => lastPage.lastDoc,
        // keepPreviousData: true,
      }
    );

  const postList = data?.pages?.flatMap((page) => page.posts) ?? [];

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const scrollRatio = (scrollTop + clientHeight) / scrollHeight;

    if (scrollRatio >= 0.7 && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <CustomTabs categoryKindOptions="mainCategory" onClickTab={onClickTab} />
      {isLoading ? (
        <CustomSkeleton skeletonType="postList" />
      ) : (
        // <Box h="100%" mb="5rem">
        <>
          <InfiniteScroll
            dataLength={postList.length}
            next={fetchNextPage}
            hasMore={hasNextPage ?? false}
            // loader={<CustomSpinner spinnerType="postListLoader" />}
            loader={<CustomSpinner spinnerType="postListLoader" />}
            endMessage={<EndMessage />}
          >
            <VStack
              gap="1rem"
              px={{ base: "0px", md: "2px" }}
              mb={{ base: "0", md: "0" }}
            >
              {postList.map((postItemData) => (
                <PostItem
                  key={postItemData.id}
                  postItemData={postItemData}
                  toggleLikePost={toggleLikePost}
                />
              ))}
            </VStack>
          </InfiniteScroll>

          <CustomModal
            isFixSize={true}
            isButtonHideMdScreen={isMdScreen ?? true}
          >
            <CreatePostContainer />
          </CustomModal>
        </>
      )}
    </>
  );
}

export default PostListContainer;
