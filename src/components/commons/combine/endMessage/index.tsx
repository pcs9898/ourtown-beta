import { Box, Heading } from "@chakra-ui/react";

export default function EndMessage() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100%"
      height="6rem"
      mb="4rem"
    >
      <Heading size="md">No More Post</Heading>
    </Box>
  );
}
