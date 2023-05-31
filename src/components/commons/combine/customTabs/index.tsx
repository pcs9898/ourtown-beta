import {
  Box,
  Tab,
  TabList,
  Tabs,
  useBreakpointValue,
  useTheme,
} from "@chakra-ui/react";

import { ReactNode } from "react";

interface ICustomTabsProps {
  tabList: string[];
  isCreatePost?: boolean;
  onClickTab: (tab: string) => void;
}

export default function CustomTabs({
  tabList,
  isCreatePost,
  onClickTab,
}: ICustomTabsProps) {
  const pxValue = useBreakpointValue({
    base: 0,
    "32.3125rem": "0.1rem",
  });

  const handleClickTab = (tab: string = "Daily") => {
    onClickTab(tab);
  };

  return (
    <>
      <Tabs
        size="md"
        variant="solid-rounded"
        overflow="hidden"
        overflowX="scroll"
        colorScheme="teal"
        position={isCreatePost ? "unset" : "sticky"}
        top="3.5rem"
        maxHeight="14rem" // 상단 NavLayout의 높이를 제외한 높이
        zIndex={9}
        bgColor="white"
        sx={{
          "@media (max-width: 32.3125rem)": {
            "::-webkit-scrollbar": {
              display: "none",
            },
            "::-webkit-scrollbar-thumb": {},
            borderBottom: isCreatePost ? "0" : "1px solid #dbdbdb",
          },
          "@media (min-width: 32.3125rem)": {
            "&:hover": {
              "::-webkit-scrollbar": {
                display: "initial",
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
          mt={{ base: "0.1rem", md: "0.5rem" }}
          mb={{ base: "0.4rem", md: "0.5rem" }}
          pt="0.1rem"
        >
          {tabList.map((tab, index) => (
            <Tab
              borderRadius="base"
              fontWeight="semibold"
              key={index}
              onClick={() => handleClickTab(tab)}
            >
              {tab}
            </Tab>
          ))}
        </TabList>
      </Tabs>
      {/* <Box
        sx={{
          "@media (min-width: 32.3125rem)": {
            px: "0.1rem",
          },
        }}
      >
        {children} */}
      {/* 커스텀탭에 부모가 프롭스로 함수넘겨서 어떤탭했는지 보고받기 */}
      {/* </Box> */}
    </>
  );
}
