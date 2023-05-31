import { useRouter } from "next/router";

export default function PostDetailPage() {
  const router = useRouter();

  return <h1>routerPathname: {router.asPath}</h1>;
}
