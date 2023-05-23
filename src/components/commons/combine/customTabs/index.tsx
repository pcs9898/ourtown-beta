import { Tab, TabList, Tabs } from "@chakra-ui/react";

interface ICustomTabsProps {
  tabList: string[];
}

export default function CustomTabs({ tabList }: ICustomTabsProps) {
  const handleClickTab = (tab: string) => {
    console.log(tab);
    // 쿼리로 밑에 게시글 리스트 바꾸는 작업
  };
  return (
    <>
      <Tabs
        size="md"
        variant="solid-rounded"
        overflow="hidden"
        overflowX={tabList.length <= 4 ? "hidden" : "scroll"}
        colorScheme="teal"
        sx={{
          "@media (max-width: 517px)": {
            // base breakpoint
            "::-webkit-scrollbar": {
              display: tabList.length <= 4 ? "none" : "initial",
            },
          },
        }}
      >
        <TabList mx="1rem" my="0.5rem">
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
      <div>게시글 리스트</div>
    </>
  );
}
