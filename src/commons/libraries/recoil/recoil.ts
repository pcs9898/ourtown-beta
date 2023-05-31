import { atom } from "recoil";

type User = {
  uid: string;
  email: string;
  username: string;
  city: string;
  town: string;
};

export const userState = atom<User | null>({
  key: "userState",
  default: null,
});
