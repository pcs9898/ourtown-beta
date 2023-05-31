import { userState } from "@/src/commons/libraries/recoil/recoil";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export const withAuth = (Component: any) => (props: any) => {
  const isLoggedIn = useRecoilValue(userState);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, []);

  return <Component {...props} />;
};
