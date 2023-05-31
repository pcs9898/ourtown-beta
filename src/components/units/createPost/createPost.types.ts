import { ICurrentUser } from "@/src/commons/types/globalTypes";
import { ChangeEvent } from "react";

export interface ICreatePostContainer {
  onClose: () => void;
}

export interface ICreatePostPresenterProps {
  onClose: () => void;
  onClickSubmit: () => void;
  content: string;
  isButtonLoading: boolean;
  onClickTab: (data: string) => void;
  currentUser?: ICurrentUser | null;
  setContent: (value: string) => void;
  onChangeFile: (e: ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
}
