import { ReactNode, useEffect, useState } from "react";
import FooterLayout from "./footer";
import HeaderLayout from "./header";
import MainLayout from "./main";
import { useRouter } from "next/router";
import { Box, Flex, Spinner } from "@chakra-ui/react";
import { NotificationsNoneOutlined } from "@mui/icons-material";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  searchQueryState,
  userState,
} from "@/src/commons/libraries/recoil/recoil";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/src/commons/libraries/firebase/firebase";
import CustomSpinner from "../combine/customSpinner";

interface ILayoutsProps {
  children: ReactNode;
}

export default function Layouts({ children }: ILayoutsProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useRecoilState(userState);
  const setCurrentSearchQuery = useSetRecoilState(searchQueryState);
  const isLoginSignupLayout =
    router.pathname === "/login" || router.pathname === "/signup";
  const [isloading, setIsloading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userRef);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();

            setCurrentUser({
              uid: user.uid,
              email: user.email || "",
              username: userData.username,
              city: userData.city,
              town: userData.town,
              likedPosts: userData.likedPosts,
              likedDiscovers: userData.likedDiscovers,
            });

            setIsloading(false);
          } else {
            setCurrentUser(null);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        router.push("/login");
      }
      setIsloading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (isloading) {
    return <CustomSpinner spinnerType="layout" />;
  }

  return isLoginSignupLayout ? (
    <Box
      as="main"
      justifyContent="center"
      alignItems="center"
      w="100vw"
      h="100vh"
    >
      {children}
    </Box>
  ) : (
    currentUser && (
      <Box maxW="71.875rem" margin="0 auto" minH="15rem">
        <>
          <HeaderLayout />
          <MainLayout>{children}</MainLayout>
          <FooterLayout />
        </>
      </Box>
    )
  );
}
