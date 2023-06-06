import { VStack } from "@chakra-ui/react";
import PostDetail from "../../commons/combine/postDetatil";
import CommentItem from "../../commons/combine/commentItem";
import { IComment, IPost, IUser } from "@/src/commons/types/globalTypes";

export interface IPostDetailPresenterProps {
  postData: IPost;
  userData: IUser;

  commentsData: IComment[];
  createComment: (commentContent: string) => void;
  toggleLikePost: () => void;
  isLoadingComments?: boolean;
}

export default function PostDetailPresenter({
  postData,
  userData,
  commentsData,
  createComment,
  toggleLikePost,
  isLoadingComments,
}: IPostDetailPresenterProps) {
  return (
    <>
      <PostDetail
        postData={postData}
        userData={userData}
        createComment={createComment}
        toggleLikePost={toggleLikePost}
      />
      {isLoadingComments ? (
        <h1>Loading Comments</h1>
      ) : (
        <VStack
          width="100%"
          gap="0"
          mt={{ md: "0.75rem" }}
          mb={{ base: "4rem", md: "0" }}
        >
          {commentsData?.map((comment, _) => {
            return <CommentItem key={comment.id} commentItemData={comment} />;
          })}
        </VStack>
      )}
    </>
  );
}
