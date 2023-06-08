import { headerState, userState } from "@/src/commons/libraries/recoil/recoil";
import formatTimeAgo from "@/src/commons/utils/formatTimgAgo";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  Highlight,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilValue, useSetRecoilState } from "recoil";

interface ICommentItemProps {
  commentItemData: {
    content: string;
    createdAt: number;
    uid: string;
    user: {
      username: string;
      avatarUrl?: string;
      town: string;
    };
  };
}

export default function CommentItem({ commentItemData }: ICommentItemProps) {
  const {
    content,
    createdAt,
    uid: writerUid,
    user: { username, avatarUrl, town },
  } = commentItemData;
  const currentUser = useRecoilValue(userState);
  const setCurrentHeader = useSetRecoilState(headerState);
  const authorBgColor = useColorModeValue("teal.500", "teal.200");
  const authorFontColor = useColorModeValue("#EEEFF1", "gray.800");
  const router = useRouter();

  return (
    <Flex
      flexDirection="row"
      flex="1"
      gap="0.75rem"
      alignItems="center"
      px="1rem"
      py="0.5rem"
      width="100%"
    >
      <Avatar
        src={avatarUrl}
        name={username}
        onClick={() => {
          if (writerUid !== currentUser?.uid) {
            setCurrentHeader({
              profileUserName: username,
            });
            router.push(`/profile/${writerUid}`);
          } else {
            router.push("/me");
          }
        }}
        cursor="pointer"
      />
      <Box>
        <Flex alignItems="center" gap="0.25rem">
          {/* 아바타랑 Flex Link로 감싸줘야함 */}
          <Heading
            size="sm"
            onClick={() => {
              if (writerUid !== currentUser?.uid) {
                setCurrentHeader({
                  profileUserName: username,
                });
                router.push(`/profile/${writerUid}`);
              } else {
                router.push("/me");
              }
            }}
            cursor="pointer"
          >
            {" "}
            {username}
          </Heading>
          {writerUid === currentUser?.uid && ( // true 자리에 isUserLoggedIn 비교 해서 넣기
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
          <Text color="gray">‧</Text>
          <Text color="gray">{town}</Text>‧
          <Text color="gray">{formatTimeAgo(createdAt)}</Text>
        </Flex>
        <Text fontSize="1rem">{content}</Text>
      </Box>
    </Flex>
  );
}
