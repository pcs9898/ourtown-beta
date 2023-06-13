import { Box, Flex, Spinner, useColorModeValue } from "@chakra-ui/react";

interface ICustomSpinnerProps {
  spinnerType: "layout" | "postListLoader";
}

export default function CustomSpinner({ spinnerType }: ICustomSpinnerProps) {
  const spinnerColor = useColorModeValue("teal.500", "teal.200");

  const rednerCustomSpinnerByType = (spinnerType: string) => {
    switch (spinnerType) {
      case "layout":
        return (
          <Flex justifyContent="center" alignItems="center" w="100vw" h="100vh">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={spinnerColor}
              size="xl"
            />
          </Flex>
        );
      case "postListLoader":
        return (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="100%"
            height="5rem"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color={spinnerColor}
              size="xl"
            />
          </Box>
        );
      default:
        return null;
    }
  };

  return rednerCustomSpinnerByType(spinnerType);
}
