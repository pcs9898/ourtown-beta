import { auth, db } from "@/src/commons/libraries/firebase/firebase";
import {
  isLoadingState,
  isLoggedInState,
  userState,
} from "@/src/commons/libraries/recoil/recoil";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";

interface IRouteGuardProps {
  children: ReactNode;
}

export default function RouteGuard({ children }: IRouteGuardProps) {
  const [isLoading, setIsLoading] = useRecoilState(isLoadingState);
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);
  const setUserState = useSetRecoilState(userState);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoggedIn(user ? true : false);

      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();

            setUserState({
              uid: user.uid,
              email: user.email || "",
              username: userData.username,
              city: userData.city,
              town: userData.town,
            });
          } else {
            setUserState(null);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        router.push("/login");
      }
    });
    setIsLoading(false);
    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <h1>loading</h1>;
  }

  return <>{children}</>;
}
