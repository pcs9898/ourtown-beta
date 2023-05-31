import { withAuth } from "@/src/components/commons/customhooks/withAuth";
import LoginConatinerPresenter from "@/src/components/units/login";

function LoginPage() {
  return <LoginConatinerPresenter />;
}

export default withAuth(LoginPage);
