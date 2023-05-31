import { ChangeEvent, useState } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { useToast } from "@chakra-ui/react";
import { getDownloadURL } from "firebase/storage";
import { app, db } from "@/src/commons/libraries/firebase/firebase";
import { useRecoilValue } from "recoil";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { ICreatePostContainer } from "./createPost.types";
import CreatePostPresenter from "./createPost.presenert";

export default function CreatePostContainer({ onClose }: ICreatePostContainer) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [category, setCategory] = useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const currentUser = useRecoilValue(userState);
  const toast = useToast();
  const router = useRouter();

  const onClickSubmit = async () => {
    setIsButtonLoading(true);
    let photoUrl;
    // file storage에 올리는 로직
    try {
      if (selectedFile) {
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + selectedFile.name);
        await uploadBytes(storageRef, selectedFile);

        // 업로드된 이미지의 다운로드 URL 가져오기
        photoUrl = await getDownloadURL(storageRef);
      }
      const newPost = {
        uid: currentUser?.uid,
        category: category || "Daily",
        content,
        photoUrl: photoUrl || "",
      };

      const result = await addDoc(collection(db, "posts"), newPost);

      onClose();

      router.push(`/posts/${result.id}`);
    } catch (error: any) {
      console.error("파일 업로드 중 오류가 발생했습니다:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000, // Set the desired duration in milliseconds (e.g., 5000 for 5 seconds)
        isClosable: true,
      });
      setIsButtonLoading(false);
    }
  };

  const onClickTab = (data: string) => {
    setCategory(data);
  };

  const onChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // <input type="file" multiple /> 에서 multiple 속성으로 여러개 드래그 가능
    if (!file) return;

    // 2. 임시URL 생성 => (진짜URL - 다른 브라우저에서도 접근 가능)
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        // 게시판에서 event.target.id 대신 event.currentTarget.id를 썼던 이유: event.target은 태그만을 가르키지 않음
        // 미리보기용
        setPreviewImage(event.target?.result);
        // DB에 넣어주기용
        setSelectedFile(file);
      }
    };
  };

  return (
    <CreatePostPresenter
      onClose={onClose}
      onClickSubmit={onClickSubmit}
      content={content}
      isButtonLoading={isButtonLoading}
      onClickTab={onClickTab}
      currentUser={currentUser}
      setContent={setContent}
      onChangeFile={onChangeFile}
      previewImage={previewImage}
    />
  );
}
