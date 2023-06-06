import { useMutation, useQuery } from "react-query";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/src/commons/libraries/firebase/firebase";
import { useRouter } from "next/router";
import PostDetail from "../../commons/combine/postDetatil";
import { useRecoilState, useSetRecoilState } from "recoil";
import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import { IComment, IPost, IUser } from "@/src/commons/types/globalTypes";
import { VStack, useToast } from "@chakra-ui/react";
import CommentItem from "../../commons/combine/commentItem";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";
import PostDetailPresenter from "./postDetail.presenert";
import CustomSkeleton from "../../commons/combine/customSkeleton";

export default function PostDetailContainer() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const setCurrentHeader = useSetRecoilState(headerState);
  const postId = router.asPath.split("/")[2];
  const toast = useToast();

  const fetchPostData = async () => {
    try {
      // 파이어베이스에서 해당 postId의 포스트 데이터 가져오기

      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);

      if (postSnapshot.exists()) {
        const postData = postSnapshot.data() as IPost;
        postData.id = postSnapshot.id;

        const userRef = doc(db, "users", postData.uid);
        const userSnapshot = await getDoc(userRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data() as IUser;

          const commentsData: IComment[] = [];
          for (const commentId of postData.commentsId) {
            const commentRef = doc(db, "comments", commentId);
            const commentSnapshot = await getDoc(commentRef);

            if (commentSnapshot.exists()) {
              const commentData = commentSnapshot.data() as IComment;

              // 사용자 정보 가져오기
              const userUid = commentData.uid; // 댓글 작성자의 UID
              const userRef = doc(db, "users", userUid);
              const userSnapshot = await getDoc(userRef);

              if (userSnapshot.exists()) {
                const userData = userSnapshot.data() as IUser;
                commentData.user = userData; // 유저 정보 추가
                commentData.id = commentSnapshot.id;
                commentsData.push(commentData);
              } else {
                throw new Error("User not found");
              }
            }
          }

          setCurrentHeader({
            title: `${userData.username}'s Post`,
          });

          return { postData, userData, commentsData };
        } else {
          throw new Error("User not found");
        }
      } else {
        throw new Error("Post not found");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error occurred while fetching post data");
    }
  };

  const createCommentMutation = useMutation(
    async (commentContent: string) => {
      const newComment = {
        uid: currentUser?.uid,
        content: commentContent,
        createdAt: new Date().getTime(),
      };

      const commentRef = await addDoc(collection(db, "comments"), newComment);
      const newCommentId = commentRef.id;

      const postRef = doc(db, "posts", postId);
      const postSnapshot = await getDoc(postRef);
      const postCommentsId = postSnapshot.get("commentsId") || [];
      const updatedCommentsId = [...postCommentsId, newCommentId];
      await updateDoc(postRef, { commentsId: updatedCommentsId });

      return { newCommentId, newComment };
    },
    {
      onSuccess: ({ newCommentId, newComment }) => {
        queryClient.setQueryData(["post", postId], (prevData: any) => {
          if (prevData) {
            return {
              ...prevData,
              postData: {
                ...prevData.postData,
                commentsId: [...prevData.postData.commentsId, newCommentId],
              },
              commentsData: [
                ...prevData.commentsData,
                {
                  ...newComment,
                  id: newCommentId,
                  user: {
                    username: currentUser?.username,
                    avatarUrl: currentUser?.avatarUrl,
                    town: currentUser?.town,
                  },
                },
              ],
            };
          }
          return prevData;
        });
      },
      onError: (error: unknown) => {
        if (error instanceof Error) {
          toast({
            title: "Error",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      },
    }
  );

  const toggleIsLikedMutation = useMutation(
    async () => {
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

      return isLiked;
    },
    {
      onSuccess: (isLiked) => {
        queryClient.setQueryData(["post", postId], (prevData: any) => {
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
            return {
              ...prevData,
              postData: {
                ...prevData.postData,
                likeCount: prevData.postData.likeCount + (isLiked ? -1 : 1),
              },
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

  const createComment = (commentContent: string) => {
    if (commentContent) {
      createCommentMutation.mutate(commentContent);
    }
  };

  const toggleLikePost = () => {
    toggleIsLikedMutation.mutate();
  };

  const { data, isLoading, isError } = useQuery(
    ["post", postId],
    fetchPostData
  );
  // const { postData, userData, commentsData } = data;

  if (isError) {
    return <div>Error occurred while fetching post data</div>; // 에러 발생 시 표시
  }

  return isLoading ? (
    <CustomSkeleton skeletonType="postDetail" />
  ) : (
    data && (
      <PostDetailPresenter
        postData={data?.postData}
        userData={data?.userData}
        commentsData={data?.commentsData}
        createComment={createComment}
        toggleLikePost={toggleLikePost}
      />
    )
  );
}
