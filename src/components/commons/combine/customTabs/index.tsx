import {
  Box,
  Tab,
  TabList,
  Tabs,
  useBreakpointValue,
  useColorMode,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import React, { ReactNode } from "react";

interface ICustomTabsProps {
  isCreatePost?: boolean;
  onClickTab: (tab: string) => void;
  categoryKindOptions:
    | "mainCategory"
    | "dicoverBigCategory"
    | "discoverSmallRestaurantCategory"
    | "profileCategory"
    | "meProfileCategory"
    | "languageSettings";
}

function CustomTabs({
  isCreatePost,
  onClickTab,
  categoryKindOptions,
}: ICustomTabsProps) {
  const pxValue = useBreakpointValue({
    base: 0,
    "32.3125rem": "0.1rem",
  });
  const router = useRouter();
  const backgroundColor = useColorModeValue("white", "gray.800");
  const borderBottomColor = useColorModeValue("#dbdbdb", "none");
  const { colorMode } = useColorMode();
  const { t, i18n } = useTranslation();

  const handleClickTab = (tab: string = "Daily") => {
    onClickTab(tab);
  };

  const getLanguageCategoryOptions = (ccategoryKindOptions: string) => {
    switch (categoryKindOptions) {
      case "mainCategory":
        return [
          t("mainCategoryTab1"),
          t("mainCategoryTab2"),
          t("mainCategoryTab3"),
          t("mainCategoryTab4"),
          t("mainCategoryTab5"),
          t("mainCategoryTab6"),
          t("mainCategoryTab7"),
        ];
      case "meProfileCategory":
        return [
          t("meProfileCategoryTab1"),
          t("meProfileCategoryTab2"),
          t("meProfileCategoryTab3"),
        ];
      case "profileCategory":
        return [t("mainCategoryTab2")];
      case "dicoverBigCategory":
        return [
          t("dicoverBigCategoryTab1"),
          t("dicoverBigCategoryTab2"),
          t("dicoverBigCategoryTab3"),
          t("dicoverBigCategoryTab4"),
          t("dicoverBigCategoryTab5"),
        ];
      default:
        return [];
    }
  };

  const getCategoryOptions = (categoryKindOptions: string): string[] => {
    switch (categoryKindOptions) {
      case "mainCategory":
        return [
          "Daily",
          "News",
          "Secondhand",
          "Restaurants",
          "Parttime",
          "Together",
          "Exercise",
        ];
      case "dicoverBigCategory":
        return [
          "Restaurant",
          "Cafe/Dessert",
          "Salon/Beauty",
          "Hospital/Pharmacy",
          "Exercise",
        ];
      case "discoverSmallRestaurantCategory":
        return [
          "Korean Cuisine",
          "Western Cuisine",
          "Chinese Cuisine",
          "Snacks",
          "Japanese",
        ];
      case "meProfileCategory":
        return ["Posts", "Liked", "Saved"];
      case "profileCategory":
        return ["Posts"];
      default:
        return ["hi"];
    }
  };

  return (
    <>
      <Tabs
        size="md"
        variant="solid-rounded"
        overflow="hidden"
        overflowX="scroll"
        colorScheme={colorMode === "light" ? "teal" : "customTealForColorMode"}
        position={isCreatePost ? "unset" : "sticky"}
        top="3.5rem"
        maxHeight="14rem" // 상단 NavLayout의 높이를 제외한 높이
        zIndex={9}
        bgColor={isCreatePost ? "none" : backgroundColor}
        sx={{
          "@media (max-width: 32.3125rem)": {
            "::-webkit-scrollbar": {
              display: "none",
            },
            "::-webkit-scrollbar-thumb": {},
            borderBottom:
              isCreatePost || categoryKindOptions === "languageSettings"
                ? "0"
                : `1px solid ${borderBottomColor}`,
          },
          "@media (min-width: 32.3125rem)": {
            "&:hover": {
              "::-webkit-scrollbar": {
                display:
                  router.pathname.includes("/profile/") ||
                  router.pathname === "/me"
                    ? "none"
                    : "initial",
                height: "5px",
                borderRadius: "50px",
              },
              "::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "50px",
              },
            },
            "::-webkit-scrollbar": {
              display: "none",
            },
            "::-webkit-scrollbar-thumb": {},
          },
        }}
      >
        <TabList
          mx={isCreatePost ? "0rem" : "1rem"}
          mt={{
            base: "0.1rem",
            md: router.pathname.includes("/profile/") ? "0.1rem" : "0.5rem",
          }}
          mb={{ base: "0.4rem", md: "0.5rem" }}
          pt="0.1rem"
          display="flex"
        >
          {getCategoryOptions(categoryKindOptions).map((tab, index) => (
            <Tab
              borderRadius="base"
              fontWeight="semibold"
              key={index}
              onClick={() => handleClickTab(tab)}
              sx={{
                whiteSpace: "nowrap", // 줄바꿈 방지
              }}
            >
              {getLanguageCategoryOptions(categoryKindOptions)[index]}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </>
  );
}

export default React.memo(CustomTabs);
