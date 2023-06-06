import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  Highlight,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
  MoreHoriz,
} from "@mui/icons-material";
import AddCommentOrReview from "../formInput";
import Link from "next/link";
import formatTimeAgo from "@/src/commons/utils/formatTimgAgo";
import { useRecoilValue } from "recoil";
import { userState } from "@/src/commons/libraries/recoil/recoil";

interface IPostDetailProps {
  postData: {
    uid: string;
    id: string;
    town: string;

    likeCount: number;
    content: string;
    imageUrl?: string;
    createdAt: number;
    commentsId: string[];
  };
  userData: {
    uid: string;
    username: string;
    avatarUrl?: string;
  };
  isLiked: boolean;
  createComment: (data: string) => void;
  commentCount: number;
  toggleLikePost: () => void;
}

export default function PostDetail({
  postData,
  userData,
  createComment,
  toggleLikePost,
}: IPostDetailProps) {
  const { town, createdAt, likeCount, content, imageUrl, uid, id, commentsId } =
    postData;
  const { username, avatarUrl } = userData;
  const currentUser = useRecoilValue(userState);

  return (
    <Box
      position="sticky"
      top={{ base: "3.5rem", md: "4.125rem" }}
      zIndex={1200}
      bgColor="white"
    >
      <Card mb="2px" boxShadow="md">
        <CardHeader display="flex" px="1rem" py="0.75rem">
          <Flex flex="1" gap="0.75rem" alignItems="center" flexWrap="wrap">
            <Link href={`/profile/${uid}`}>
              <Avatar name={username} src={avatarUrl} />
            </Link>
            <Box>
              <Flex gap="0.25rem">
                <Heading size="sm">{username}</Heading>
                {uid === currentUser?.uid && ( // true 자리에 isUserLoggedIn 비교 해서 넣기
                  <Highlight
                    query="Author"
                    styles={{
                      bg: "main",
                      borderRadius: "base",
                      color: "white",
                      px: "0.375rem",
                      py: "0",
                      fontWeight: "semibold",
                      marginLeft: "0.25rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    Author
                  </Highlight>
                )}
              </Flex>
              <Flex color="subText" gap="0.25rem">
                <Text>{town}</Text>
                <Text>‧</Text>
                <Text>{formatTimeAgo(createdAt)}</Text>
              </Flex>
            </Box>
          </Flex>
          {/* 여기에 아바타 링크걸기 */}
          <IconButton
            variant="ghost"
            aria-label="See menu"
            icon={<MoreHoriz />}
          />
        </CardHeader>

        {imageUrl && (
          <Image
            height="12rem"
            objectFit="cover"
            src={imageUrl}
            alt="Chakra UI"
          />
        )}

        <CardBody px="1rem" py="0.75rem">
          <Text fontSize="1rem">{content}</Text>
        </CardBody>

        <CardFooter
          px="1rem"
          paddingTop="0.75rem"
          paddingBottom="0"
          justify="flex-end"
        >
          <Button
            variant="ghost"
            leftIcon={
              currentUser?.likedPosts?.includes(id) ? (
                <Favorite />
              ) : (
                <FavoriteBorder />
              )
            }
            onClick={toggleLikePost}
          >
            {" "}
            {likeCount}
          </Button>
          <Button variant="ghost" leftIcon={<ChatBubbleOutline />}>
            {postData.commentsId.length}
          </Button>
        </CardFooter>
        <AddCommentOrReview onSubmit={createComment} isComment={true} />
      </Card>
    </Box>
  );
}
