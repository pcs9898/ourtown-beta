import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  ArrowBackIosNew,
  KeyboardArrowDown,
  NotificationsNone,
} from "@mui/icons-material";
import SearchBar from "../../combine/searchBar";

interface IHeaderLayoutProps {
  city: string;
  mobileSelectButton?: boolean;
  mobileRightIcon?: React.ReactElement;
  mobileRightIconArialabel?: string;
  mobileBackButton?: boolean;
  mobileMainTitle?: string;
  mobileSubTitle?: React.ReactElement | string;
  mobileSearchBar?: boolean;
}

export default function HeaderLayout({
  city,
  mobileSelectButton,
  mobileRightIcon,
  mobileRightIconArialabel = "Icon Button",
  mobileBackButton,
  mobileMainTitle,
  mobileSubTitle,
  mobileSearchBar,
}: IHeaderLayoutProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px="1rem"
      py="0.5rem"
      height="3.5rem"
      bgColor="white"
      position="sticky"
      top={0}
      zIndex={10}
    >
      {isMobile && (
        <>
          {mobileSelectButton && (
            <Button colorScheme="teal" rightIcon={<KeyboardArrowDown />}>
              {city}
            </Button>
          )}
          {mobileBackButton && (
            <IconButton
              variant="ghost"
              aria-label="Back Button"
              icon={<ArrowBackIosNew />}
            />
          )}
          {/* go back routing add */}
          {mobileMainTitle && <Heading h="2.5rem">{mobileMainTitle}</Heading>}
          {mobileSubTitle && (
            <Heading
              fontSize="1.25rem"
              textAlign="center"
              position="absolute"
              width="100%"
              left="0"
              right="0"
              margin="auto"
              zIndex="-1"
            >
              {mobileSubTitle}
            </Heading>
          )}
          {mobileRightIcon && (
            <IconButton variant="ghost" aria-label={mobileRightIconArialabel}>
              {mobileRightIcon}
            </IconButton>
          )}
          {mobileSearchBar && <SearchBar city={city} />}
          {/* search deboucing apdated */}
        </>
      )}

      {!isMobile && (
        <Flex w="100%" justifyContent="space-between">
          <Flex gap="0.75rem">
            <Image src="/logo.svg" alt="Logo Image" w="2.5rem" h="2.5rem" />
            <Button
              w="100%"
              size="md"
              colorScheme="teal"
              rightIcon={<KeyboardArrowDown />}
            >
              {city}
            </Button>
          </Flex>
          <SearchBar city={city} />
          <Flex gap="0.75rem">
            <IconButton aria-label="Notification Icon" variant="ghost">
              <NotificationsNone />
            </IconButton>
            <Avatar name="Chan Park" />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}
