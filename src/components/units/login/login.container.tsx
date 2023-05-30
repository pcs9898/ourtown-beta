import LoginSignupForm, {
  ILoginSignupForm,
} from "../../commons/combine/loginSignupForm";

export default function LoginConatiner() {
  const onSubmit = (data: ILoginSignupForm) => {
    console.log(data);
  };

  return <LoginSignupForm isSignup={false} onSubmit={onSubmit} />;
}
