import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  IconButton,
  Img,
  Input,
  ModalBody,
  ModalHeader,
  Textarea,
} from "@chakra-ui/react";
import CustomTabs from "../../commons/combine/customTabs";
import { ArrowBackIosNew } from "@mui/icons-material";
import PhotoIcon from "@mui/icons-material/Photo";
import { ICreatePostPresenterProps } from "./createPost.types";

export default function CreatePostPresenter({
  onClose,
  onClickSubmit,
  content,
  isButtonLoading,
  onClickTab,
  currentUser,
  setContent,
  onChangeFile,
  previewImage,
}: ICreatePostPresenterProps) {
  return (
    <>
      <ModalHeader p="0">
        <Flex justifyContent="space-between" alignItems="center">
          <IconButton
            icon={<ArrowBackIosNew />}
            aria-label="Go back"
            onClick={onClose}
            variant="ghost"
            zIndex="1"
          />

          <Heading
            fontSize="1.25rem"
            textAlign="center"
            position="absolute"
            width="100%"
            left="0"
            right="0"
            margin="auto"
          >
            Create Post
          </Heading>
          <Button
            colorScheme="teal"
            onClick={onClickSubmit}
            isDisabled={!content}
            isLoading={isButtonLoading}
          >
            Post
          </Button>
          {/* mutation link */}
        </Flex>
      </ModalHeader>
      <ModalBody
        marginTop="0.75rem"
        overflowY="scroll"
        p="0"
        display="flex"
        flexDir="column"
        sx={{
          "&::-webkit-scrollbar": {
            width: "4px",
            borderRadius: "50px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "50px",
          },
          "@media (min-width: 32.375rem)": {
            height: "auto",
            // maxHeight: "70%",
            // my: "auto",
          },
        }}
      >
        <CustomTabs
          isCreatePost={true}
          categoryKindOptions="mainCategory"
          onClickTab={onClickTab}
        />

        <Flex
          flexDir="column"
          gap="1rem"
          h="100%"
          justifyContent="space-between"
          sx={{
            "@media (max-width: 32.375rem)": {
              // height: "100%",
              // maxHeight: "70%",
              // my: "auto",
              // borderRadius: "base",
            },
          }}
        >
          <Textarea
            flex="1"
            placeholder={`Ask questions or talk about ${currentUser?.town} neighborhood`}
            variant="unstyled"
            // height="100%"
            onChange={(e) => setContent(e.target.value)}
          />
          <Flex gap="1rem">
            <FormLabel
              htmlFor="image-upload"
              h="100%"
              mx="0"
              display="flex"
              alignItems="center"
            >
              <IconButton
                as="label"
                htmlFor="image-upload"
                aria-label="Upload Image"
                icon={<PhotoIcon />}
                // size="lg"
                colorScheme="teal"
                cursor="pointer"
              />
            </FormLabel>
            <Input
              type="file"
              id="image-upload"
              accept="image/*"
              display="none"
              onChange={onChangeFile}
            />

            <Box w="5rem" h="5rem">
              {previewImage && (
                <Img objectFit="cover" w="100%" h="100%" src={previewImage} />
              )}
            </Box>
          </Flex>
        </Flex>
      </ModalBody>
    </>
  );
}
