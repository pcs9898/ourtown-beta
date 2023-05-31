import { ReactNode, useEffect, useState } from "react";
import FooterLayout from "./footer";
import HeaderLayout from "./header";
import MainLayout from "./main";
import { useRouter } from "next/router";
import { Box } from "@chakra-ui/react";
import { NotificationsNoneOutlined } from "@mui/icons-material";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/src/commons/libraries/firebase/firebase";

interface ILayoutsProps {
  children: ReactNode;
}

export default function Layouts({ children }: ILayoutsProps) {
  const router = useRouter();
  const setUserState = useSetRecoilState(userState);
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
      }
      setIsloading(false);
    });
    // setIsLoading(false);
    return () => {
      unsubscribe();
    };
  }, []);

  if (isloading) {
    return <h1>loading</h1>;
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
    <Box maxW="71.875rem" margin="0 auto">
      <>
        <HeaderLayout
          city="suwon"
          mobileSelectButton={true}
          mobileRightIcon={<NotificationsNoneOutlined />}
        />
        <MainLayout>{children}</MainLayout>
        <FooterLayout />
      </>
    </Box>
  );
}
