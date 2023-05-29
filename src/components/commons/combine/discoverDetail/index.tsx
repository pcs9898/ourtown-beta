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
import FormInput from "../formInput";

interface IDiscoverDetailProps {
  discoverDetailData: {
    imgUrl: string;
    storeName: string;
    town: string;
    storeCategory: string;
    isBookmarked: boolean;
    reviewCount: number;
  };
}

export default function DiscoverDetail({
  discoverDetailData,
}: IDiscoverDetailProps) {
  const { storeName, imgUrl, town, storeCategory, isBookmarked, reviewCount } =
    discoverDetailData;
  return (
    <Card>
      <Image height="12rem" objectFit="cover" src={imgUrl} alt="Chakra UI" />

      <Flex px="1rem" py="0.75rem" alignItems="center">
        <Flex flex="1" gap="0.75rem" alignItems="center">
          <Box>
            <Flex gap="0.25rem" alignItems="center">
              <Heading size="sm">{storeName}</Heading>
            </Flex>
            <Text color="subText">{town + " ‧ " + storeCategory}</Text>
          </Box>
        </Flex>

        <Box>
          <IconButton
            variant="ghost"
            aria-label=""
            icon={isBookmarked ? <Bookmark /> : <TurnedInNot />}
          />
          {/* 여기에 bookmark mutation걸기 */}
          <Button variant="ghost" leftIcon={<ChatBubbleOutline />}>
            {reviewCount}
          </Button>
        </Box>
      </Flex>

      <FormInput isComment={false} />
    </Card>
  );
}
