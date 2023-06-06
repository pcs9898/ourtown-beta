import {
  headerState,
  searchQueryState,
  userState,
} from "@/src/commons/libraries/recoil/recoil";
import { useDebounce } from "use-debounce";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import CustomTabs from "../../commons/combine/customTabs";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  doc,
  getDoc,
  startAfter,
  limit,
  updateDoc,
  arrayRemove,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/src/commons/libraries/firebase/firebase";
import { useInfiniteQuery, useMutation, useQuery } from "react-query";
import { Flex, Heading, VStack } from "@chakra-ui/react";
import PostItem from "../../commons/combine/postItem";
import { useRouter } from "next/router";
import CustomSkeleton from "../../commons/combine/customSkeleton";
import EndMessage from "../../commons/combine/endMessage";
import CustomSpinner from "../../commons/combine/customSpinner";
import InfiniteScroll from "react-infinite-scroll-component";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";
import { subtract } from "loadsh";

export default function SearchContainer() {
  const [currentSearchQuery, setCurrentSearchQuery] =
    useRecoilState(searchQueryState);
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const [category, setCategory] = useState("Daily");
  const router = useRouter();
  const [debouncedSearchTerm] = useDebounce(currentSearchQuery, 500);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!url.includes("/search") && !url.includes("/posts/")) {
        setCurrentSearchQuery("");
      }
    };

    // 페이지 이동 시작 시 호출되는 이벤트 리스너 등록
    router.events.on("routeChangeStart", handleRouteChange);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router, setCurrentSearchQuery]);

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
        queryClient.setQueryData(
          ["search", category, debouncedSearchTerm],
          (prevData: any) => {
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
          }
        );
      },

      onError: (error) => {
        console.error(error);
      },
    }
  );

  const toggleLikePost = (postId: string) => {
    toggleIsLikedMutation.mutate(postId);
  };

  const searchDocuments = async (
    category: string,
    searchTerm: string,
    startAfterDoc
  ) => {
    const postsRef = collection(db, "posts");

    // 검색 쿼리 생성
    let q = query(
      postsRef,
      where("category", "==", category),
      where("content", ">=", searchTerm),
      where("content", "<=", searchTerm + "\uf8ff")
    );

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    q = query(q, limit(5));
    // 쿼리 실행
    const querySnapshot = await getDocs(q);

    // 결과 반환
    const results: any = [];
    await Promise.all(
      querySnapshot.docs.map(async (queryDoc) => {
        const postData = queryDoc.data();
        const docRef = doc(collection(db, "users"), postData.uid);
        const userDoc = await getDoc(docRef);
        const userData = userDoc.exists() ? userDoc.data() : null;
        results.push({ id: queryDoc.id, ...postData, user: userData });
      })
    );

    // createdAt 필드를 기준으로 오름차순 정렬
    const sortedResults = results.sort((a, b) => a.createdAt - b.createdAt);

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    // 포스트가 4개 미만인 경우에는 더 이상의 페이지가 없음을 알림

    const hasNextPage = sortedResults.length >= 5;

    return { posts: sortedResults, lastDoc: hasNextPage ? lastDoc : undefined };
  };

  const { isLoading, data, fetchNextPage, hasNextPage, isError, error } =
    useInfiniteQuery(
      ["search", category, debouncedSearchTerm],
      ({ pageParam }) => {
        if (debouncedSearchTerm) {
          return searchDocuments(category, debouncedSearchTerm, pageParam);
        } else {
          return Promise.resolve([]);
        }
      },
      {
        getNextPageParam: (lastPage) => lastPage.lastDoc,
        // keepPreviousData: true,
      }
    );

  const postList =
    data?.pages
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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isError) {
    console.log(error);
  }

  return (
    <>
      <CustomTabs categoryKindOptions="mainCategory" onClickTab={onClickTab} />
      {isLoading ? (
        <CustomSkeleton skeletonType="postList" />
      ) : postList.length === 0 ? (
        <Flex
          flex="1"
          justifyContent="center"
          alignItems="center"
          w="100%"
          h="88.3vh"
          gap="0.5rem"
        >
          <Heading size="md" fontWeight="normal">
            No results found for
          </Heading>
          <Heading size="md">{`"${currentSearchQuery}"`}</Heading>
        </Flex>
      ) : (
        <>
          <InfiniteScroll
            dataLength={postList.length}
            next={fetchNextPage}
            hasMore={hasNextPage ?? false}
            loader={<CustomSpinner spinnerType="postListLoader" />}
            endMessage={
              currentSearchQuery === "" || isLoading ? null : <EndMessage />
            }
          >
            <VStack
              gap="1rem"
              px={{ base: "0px", md: "2px" }}
              mb={{ base: "0", md: "0" }}
            >
              {postList
                .filter((postItemData) => postItemData !== undefined)
                .map((postItemData) => (
                  <PostItem
                    key={postItemData.id}
                    postItemData={postItemData}
                    toggleLikePost={toggleLikePost}
                  />
                ))}
            </VStack>
          </InfiniteScroll>
        </>
      )}
    </>
  );
}
