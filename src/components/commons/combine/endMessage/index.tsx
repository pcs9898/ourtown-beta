import { Box, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function EndMessage() {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      w="100%"
      height="6rem"
      mb="4rem"
    >
      <Heading size="md">{t("endMessage")}</Heading>
    </Box>
  );
}
