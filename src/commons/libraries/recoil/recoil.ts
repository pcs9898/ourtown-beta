import { atom } from "recoil";
import { IHeaderState, IUser } from "../../types/globalTypes";

export const userState = atom<IUser | null>({
  key: "userState",
  default: null,
});

export const headerState = atom<IHeaderState | null>({
  key: "headerState",
  default: null,
});

export const searchQueryState = atom<string>({
  key: "searchQueryState",
  default: "",
});
