import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import LoginSignupForm, {
  ILoginSignupForm,
} from "../../commons/combine/loginSignupForm";
import { auth, db, provider } from "@/src/commons/libraries/firebase/firebase";
import { useToast } from "@chakra-ui/react";
import { doc, getDoc } from "firebase/firestore";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import { useSetRecoilState } from "recoil";
import { useRouter } from "next/router";
import { useState } from "react";

export default function LoginConatinerPresenter() {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const setUserState = useSetRecoilState(userState);

  async function signInWithGoogle() {
    try {
      setIsButtonLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userSnapshot = await getDoc(doc(db, "users", user.uid));

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        setUserState({
          uid: user.uid,
          email: user.email || "",
          username: userData.username,
          city: userData.city,
          town: userData.town,
          isLiked: userData.isLiked,
        });
      }
      router.push("/");
      setIsButtonLoading(false);
      toast({
        title: "Success",
        description: "Login Sucess",
        status: "success",
        duration: 5000, // Set the desired duration in milliseconds (e.g., 5000 for 5 seconds)
        isClosable: true,
      });
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000, // Set the desired duration in milliseconds (e.g., 5000 for 5 seconds)
        isClosable: true,
      });
      setIsButtonLoading(false);
    }
  }

  const onSubmit = async ({ email, password }: ILoginSignupForm) => {
    try {
      setIsButtonLoading(true);
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const userSnapshot = await getDoc(doc(db, "users", user.uid));

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        setUserState({
          uid: user.uid,
          email: user.email || "",
          username: userData.username,
          city: userData.city,
          town: userData.town,
          isLiked: userData.isLiked,
        });
      }
      router.push("/");
      setIsButtonLoading(false);
    } catch (error: any) {
      console.error("Error:", error);
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

  return (
    <LoginSignupForm
      isButtonLoading={isButtonLoading}
      isSignup={false}
      onSubmit={onSubmit}
      handleGoole={signInWithGoogle}
    />
  );
}
