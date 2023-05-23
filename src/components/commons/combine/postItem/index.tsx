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

interface IPostItemProps {
  postItemData: {
    town: string;
    time: string;
    likeCount: number;
    commentCount: number;
    contents: string;
    avatarUrl: string;
    username: string;
    imgUrl: string;
    isLiked: boolean;
  };
}

export default function PostItem({ postItemData }: IPostItemProps) {
  const {
    town,
    time,
    likeCount,
    commentCount,
    contents,
    imgUrl,
    avatarUrl,
    username,
    isLiked,
  } = postItemData;

  return (
    <Card>
      <CardHeader display="flex" px="1rem" py="0.75rem">
        <Flex flex="1" gap="0.75rem" alignItems="center" flexWrap="wrap">
          <Avatar name={username} src={avatarUrl} />
          <Box>
            <Heading size="sm">{username}</Heading>
            <Text color="subText">{town + " ‧ " + time}</Text>
          </Box>
        </Flex>
        {/* 여기에 아바타 링크걸기 */}
        <IconButton
          variant="ghost"
          aria-label="See menu"
          icon={<MoreHoriz />}
        />
      </CardHeader>

      <Image height="12rem" objectFit="cover" src={imgUrl} alt="Chakra UI" />

      <CardBody px="1rem" py="0.75rem">
        <Text fontSize="1rem">{contents}</Text>
      </CardBody>
      {/* 여기에 postdetail 링크걸기 */}
      <CardFooter px="1rem" py="0.75rem" justify="flex-end">
        <Button
          variant="ghost"
          leftIcon={isLiked ? <Favorite /> : <FavoriteBorder />}
        >
          {likeCount}
          {/* 여기에 likePost mutation걸기 */}
        </Button>
        <Button variant="ghost" leftIcon={<ChatBubbleOutline />}>
          {commentCount}
          {/* 여기에 postdetail 링크걸기 */}
        </Button>
      </CardFooter>
    </Card>
  );
}
