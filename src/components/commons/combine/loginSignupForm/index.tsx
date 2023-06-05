import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Img,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Google } from "@mui/icons-material";
import NextLink from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";

interface ILoginSignupFormProps {
  isButtonLoading: boolean;
  isSignup: boolean;
  onSubmit: (data: ILoginSignupForm) => void;
  handleGoole: () => void;
}

export interface ILoginSignupForm {
  username?: string;
  email: string;
  password: string;
}

export default function LoginSignupForm({
  isSignup,
  onSubmit,
  handleGoole,
  isButtonLoading,
}: ILoginSignupFormProps) {
  const schema = yup.object().shape({
    ...(isSignup && {
      username: yup
        .string()
        .required("Username is required")
        .min(1, "Username must be at least 3 characters")
        .max(5, "Username cannot exceed 20 characters"),
    }),
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup
      .string()
      .required("Password is required")
      .min(1, "Password must be at least 6 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ILoginSignupForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      px="1rem"
      maxW="38.5rem"
      margin="0 auto"
      gap="1.75rem"
      justifyContent="center"
      alignItems="center"
      h="100%"
    >
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={{ base: "1.75rem", md: "0.625rem" }}
      >
        <Img src="logo.svg" boxSize={{ base: "8rem", md: "10.625rem" }} />
        <Heading textAlign="center" size="lg">
          Discover your neighborhood
        </Heading>
      </Flex>

      <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="0.75rem">
          {isSignup && (
            <FormControl isInvalid={!!errors.username}>
              <Input
                placeholder="Username"
                variant="filled"
                fontWeight="semibold"
                {...register("username")}
              />
              <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
            </FormControl>
          )}
          <FormControl isInvalid={!!errors.email}>
            <Input
              placeholder="Email"
              variant="filled"
              fontWeight="semibold"
              {...register("email")}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <Input
              placeholder="Password"
              variant="filled"
              fontWeight="semibold"
              {...register("password")}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            width="100%"
            colorScheme="teal"
            isDisabled={!isValid}
            isLoading={isButtonLoading}
          >
            {isSignup ? "Sign up" : "Log in"}
          </Button>

          <Divider />

          <Button
            leftIcon={<Google />}
            width="100%"
            onClick={handleGoole}
            isLoading={isButtonLoading}
          >
            Continue with google
          </Button>
          <Text fontSize="1rem" fontWeight="semibold">
            {isSignup ? "Have an account?" : "New to Ourtown?"}
            <Link
              as={NextLink}
              href={isSignup ? "/login" : "/signup"}
              color="main"
              ml="0.5rem"
            >
              {isSignup ? "Log in" : "Sign Up"}
            </Link>
          </Text>
        </VStack>
      </form>
    </Flex>
  );
}
