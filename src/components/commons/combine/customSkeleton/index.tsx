import { Box, Flex, Skeleton, SkeletonCircle, VStack } from "@chakra-ui/react";

interface ICustomSkeletonProps {
  skeletonType: "postDetail" | "postList";
}

export default function CustomSkeleton({ skeletonType }: ICustomSkeletonProps) {
  const renderSkeletonByTypes = (skeletonType: string) => {
    switch (skeletonType) {
      case "postDetail":
        return (
          <Box width="100%">
            <Box boxShadow="lg" borderRadius="base" bg="white" w="100%">
              <Flex
                flexDirection="row"
                alignItems="center"
                px="1rem"
                py="0.75rem"
                gap="0.75rem"
              >
                <SkeletonCircle size="10" />
                <Skeleton width="7.5rem" height="2.5rem" />
              </Flex>

              <Skeleton height="12rem" />
              <Skeleton height="1.5rem" mx="1rem" my="0.75rem" />

              <Flex mx="1rem" justifyContent="flex-end">
                <Skeleton
                  width="2.5rem"
                  height="1.5rem"
                  mx="1rem"
                  my="1.25rem"
                />
                <Skeleton
                  width="2.5rem"
                  height="1.5rem"
                  mx="1rem"
                  my="1.25rem"
                />
              </Flex>
            </Box>
            {Array.from(Array(8)).map((_, i) => (
              <Flex
                key={i}
                flexDirection="row"
                alignItems="center"
                px="1rem"
                py="0.75rem"
                gap="0.75rem"
              >
                <SkeletonCircle size="10" />
                <Flex flexDir="column" gap="0.5rem" flex="1">
                  <Skeleton width="50%" height="1.0rem" />
                  <Skeleton width="30%" height="1.0rem" />
                </Flex>
              </Flex>
            ))}
          </Box>
        );
      case "postList":
        return (
          <>
            {Array.from({ length: 2 }).map((_, i) => (
              <Box key={i} width="100%">
                <Box boxShadow="lg" borderRadius="base" bg="white" w="100%">
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    px="1rem"
                    py="0.75rem"
                    gap="0.75rem"
                  >
                    <SkeletonCircle size="10" />
                    <Skeleton width="7.5rem" height="2.5rem" />
                  </Flex>

                  <Skeleton height="12rem" />
                  <Skeleton height="1.5rem" mx="1rem" my="0.75rem" />

                  <Flex mx="1rem" justifyContent="flex-end">
                    <Skeleton
                      width="2.5rem"
                      height="1.5rem"
                      mx="1rem"
                      my="1.25rem"
                    />
                    <Skeleton
                      width="2.5rem"
                      height="1.5rem"
                      mx="1rem"
                      my="1.25rem"
                    />
                  </Flex>
                </Box>

                <Box boxShadow="lg" borderRadius="base" bg="white" w="100%">
                  <Flex
                    flexDirection="row"
                    alignItems="center"
                    px="1rem"
                    py="0.75rem"
                    gap="0.75rem"
                  >
                    <SkeletonCircle size="10" />
                    <Skeleton width="7.5rem" height="2.5rem" />
                  </Flex>

                  <Skeleton height="1.5rem" mx="1rem" my="0.75rem" />

                  <Flex mx="1rem" justifyContent="flex-end">
                    <Skeleton
                      width="2.5rem"
                      height="1.5rem"
                      mx="1rem"
                      my="1.25rem"
                    />
                    <Skeleton
                      width="2.5rem"
                      height="1.5rem"
                      mx="1rem"
                      my="1.25rem"
                    />
                  </Flex>
                </Box>
              </Box>
            ))}
          </>
        );
      default:
        return null;
    }
  };

  return <VStack w="100%">{renderSkeletonByTypes(skeletonType)}</VStack>;
}
