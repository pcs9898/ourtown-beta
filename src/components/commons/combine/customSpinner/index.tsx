import { Box, Flex, Spinner } from "@chakra-ui/react";

interface ICustomSpinnerProps {
  spinnerType: "layout" | "postListLoader";
}

const rednerCustomSpinnerByType = (spinnerType: string) => {
  switch (spinnerType) {
    case "layout":
      return (
        <Flex justifyContent="center" alignItems="center" w="100vw" h="100vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="main"
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
            color="main"
            size="xl"
          />
        </Box>
      );
    default:
      return null;
  }
};

export default function CustomSpinner({ spinnerType }: ICustomSpinnerProps) {
  return rednerCustomSpinnerByType(spinnerType);
}
