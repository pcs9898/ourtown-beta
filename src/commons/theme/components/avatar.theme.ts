import { avatarAnatomy } from "@chakra-ui/anatomy";
import {
  createMultiStyleConfigHelpers,
  defineStyleConfig,
} from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(avatarAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    bg: "main",
    color: "white",
    width: "2.5rem",
    height: "2.5rem",
  },
});

export const avatarTheme = defineStyleConfig({
  baseStyle,
  defaultProps: {
    size: "test",
  },
});
