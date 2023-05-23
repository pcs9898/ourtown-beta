import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { Bookmark, ChatBubbleOutline, TurnedInNot } from "@mui/icons-material";

interface IDiscoverCardProps {
  discoverCardData: {
    imgUrl: string;
    storeName: string;
    town: string;
    storeCategory: string;
    isBookmarked: boolean;
    reviewCount: number;
  };
}

export default function DiscoverCard({ discoverCardData }: IDiscoverCardProps) {
  const { storeName, imgUrl, town, storeCategory, isBookmarked, reviewCount } =
    discoverCardData;
  return (
    <Card
      width="90%"
      display="flex"
      flexDirection="row"
      px="0"
      py="0"
      alignItems="center"
    >
      <Flex flex="1" gap="0.75rem" alignItems="center">
        <Image
          alt="store image"
          src={imgUrl}
          height="4rem"
          width="4rem"
          objectFit="cover"
          borderRadius="base"
        />
        <Box>
          <Flex gap="0.25rem" alignItems="center">
            <Heading size="sm">{storeName}</Heading>
          </Flex>
          <Text color="subText">{town + " ‧ " + storeCategory}</Text>
        </Box>
      </Flex>
      {/* image, box에 discover detail link걸기 */}
      <Box>
        <IconButton
          variant="ghost"
          aria-label=""
          icon={isBookmarked ? <Bookmark /> : <TurnedInNot />}
        />
        {/* 여기에 bookmark mutation걸기 */}
        <Button variant="ghost" leftIcon={<ChatBubbleOutline />}>
          {reviewCount}
          {/* discover detail link걸기 */}
        </Button>
      </Box>
    </Card>
  );
}
