import { db } from "@/src/commons/libraries/firebase/firebase";
import { queryClient } from "@/src/commons/libraries/react-query/react-query";
import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import formatTimeAgo from "@/src/commons/utils/formatTimgAgo";
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
  useColorModeValue,
} from "@chakra-ui/react";
import {
  ChatBubbleOutline,
  Favorite,
  FavoriteBorder,
  MoreHoriz,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

interface IPostItemProps {
  postItemData: {
    id: string;
    town: string;
    createdAt: number;
    likeCount: number;
    commentsId: string[];
    content: string;
    imageUrl: string;
    uid: string;
    category: string;
    user: {
      id: string;
      avatarUrl?: string;
      username: string;
      likedPosts: string[];
    };
  };
  toggleLikePost: (postId: string) => void;
}

export default function PostItem({
  postItemData,
  toggleLikePost,
}: IPostItemProps) {
  const {
    id: postId,
    town,
    createdAt,
    likeCount,
    commentsId,
    content,
    uid,
    imageUrl,
    category,
    user: { avatarUrl, username },
  } = postItemData;
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const authorBgColor = useColorModeValue("teal.500", "teal.200");
  const authorFontColor = useColorModeValue("white", "#1B212D");
  const setCurrentHeader = useSetRecoilState(headerState);
  const router = useRouter();
  const { t } = useTranslation();

  const onClickPostDetail = async () => {
    await setCurrentHeader({
      title: `${username}${t("postDetailHeaderTitle")}`,
    });

    router.push(`/posts/${postId}`);
  };

  return (
    <Card width="100%">
      <CardHeader display="flex" px="1rem" py="0.75rem">
        <Flex flex="1" gap="0.75rem" alignItems="center" flexWrap="wrap">
          <Avatar
            cursor="pointer"
            name={username}
            src={avatarUrl}
            onClick={() => {
              if (uid !== currentUser?.uid) {
                setCurrentHeader({
                  profileUserName: username,
                });
                router.push(`/profile/${uid}`);
              } else {
                router.push("/me");
              }
            }}
          />

          <Box>
            <Flex gap="0.25rem">
              <Heading size="sm" as={Link} href={`/profile/${uid}`}>
                {username}
              </Heading>
              {uid === currentUser?.uid && ( // true 자리에 isUserLoggedIn 비교 해서 넣기
                <Highlight
                  query="Author"
                  styles={{
                    bg: authorBgColor,
                    borderRadius: "base",
                    color: authorFontColor,
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
            <Flex color="gray" gap="0.25rem">
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

      <Box onClick={onClickPostDetail} cursor="pointer">
        {imageUrl && (
          <Image
            height="12rem"
            width="100%"
            objectFit="cover"
            src={imageUrl}
            alt="Chakra UI"
          />
        )}

        <CardBody px="1rem" py="0.75rem">
          <Text fontSize="1rem">{content}</Text>
        </CardBody>
      </Box>
      <CardFooter px="1rem" py="0.75rem" justify="flex-end">
        <Button
          variant="ghost"
          leftIcon={
            currentUser?.likedPosts?.includes(postId) ? (
              <Favorite />
            ) : (
              <FavoriteBorder />
            )
          }
          onClick={() => toggleLikePost(postId)}
        >
          {" "}
          {likeCount}
        </Button>
        <Button
          onClick={onClickPostDetail}
          variant="ghost"
          leftIcon={<ChatBubbleOutline />}
        >
          {commentsId.length}
        </Button>
      </CardFooter>
    </Card>
  );
}
