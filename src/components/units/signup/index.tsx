import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import LoginSignupForm, {
  ILoginSignupForm,
} from "../../commons/combine/loginSignupForm";
import { auth, db } from "@/src/commons/libraries/firebase/firebase";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { userState } from "@/src/commons/libraries/recoil/recoil";
import { useState } from "react";

const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<{ city: string; town: string }> => {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_DATA_API;
  const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${lat},${lng}&pretty=1`;

  try {
    const response = await axios.get(apiUrl);
    const results = response.data.results;
    if (results.length > 0) {
      const city = results[0].components.city;
      const town = results[0].components.quarter;

      return { city, town };
    } else {
      throw { message: "No results found" };
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    throw error;
  }
};

const getPosition = () =>
  new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );

const handleGeolocationError = (error: GeolocationPositionError) => {
  console.error("Error getting geolocation:", error);
  // Handle the error appropriately, such as showing an error message
};

export default function SignupContainerPresenter() {
  const router = useRouter();
  const toast = useToast();
  const setUserState = useSetRecoilState(userState);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  async function signUpWithGoogle() {
    setIsButtonLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const {
        coords: { latitude, longitude },
      } = await getPosition();
      const { city, town } = await reverseGeocode(latitude, longitude);

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        username: user.displayName,
        city,
        town,
        likedPosts: [],
        likedDiscovers: [],
      });

      await setUserState({
        uid: user.uid,
        email: user.email || "",
        username: user.displayName || "",
        city,
        town,
        likedPosts: [],
        likedDiscovers: [],
      });
      router.push("/");
      setIsButtonLoading(false);
    } catch (error: any) {
      setIsButtonLoading(false);
      if (error instanceof GeolocationPositionError) {
        handleGeolocationError(error);
      } else {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000, // Set the desired duration in milliseconds (e.g., 5000 for 5 seconds)
          isClosable: true,
        });
      }
    }
  }

  const onSubmit = async ({ username, email, password }: ILoginSignupForm) => {
    try {
      setIsButtonLoading(true);
      const {
        coords: { latitude, longitude },
      } = await getPosition();
      const { city, town } = await reverseGeocode(latitude, longitude);

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await setDoc(doc(db, "users", user.uid), {
        username,
        city,
        town,
        likedPosts: [],
        likedDiscovers: [],
      });

      if (username) {
        await setUserState({
          uid: user.uid,
          email,
          username,
          city,
          town,
          likedPosts: [],
          likedDiscovers: [],
        });
      }

      router.push("/");
      setIsButtonLoading(false);
    } catch (error: any) {
      setIsButtonLoading(false);
      if (error instanceof GeolocationPositionError) {
        handleGeolocationError(error);
      } else {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000, // Set the desired duration in milliseconds (e.g., 5000 for 5 seconds)
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <LoginSignupForm
        isButtonLoading={isButtonLoading}
        isSignup={true}
        onSubmit={onSubmit}
        handleGoole={signUpWithGoogle}
      />
    </>
  );
}
