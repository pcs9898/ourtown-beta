import {
  searchQueryState,
  userState,
} from "@/src/commons/libraries/recoil/recoil";
import {
  Input,
  InputGroup,
  InputLeftElement,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Search } from "@mui/icons-material";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export default function SearchBar() {
  const currentUser = useRecoilValue(userState);
  const [currentSearchQuery, setCurrentSearchQuery] =
    useRecoilState(searchQueryState);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isMobile) {
      router.push("/search");
    }
    setCurrentSearchQuery(e.target.value);
  };

  return (
    <InputGroup
      flex="none"
      maxW={{ base: "100%", md: "36.25rem" }}
      w={{ base: "100%", md: "58%" }}
      sx={{
        "@media (min-width: 48rem)": {
          position: "absolute",
          width: "50%",
          left: "0",
          right: "0",
          margin: "auto",
          marginLeft: "15.25rem",
          transition: "width 0.1s",
        },
        "@media (min-width: 58.75rem)": {
          position: "absolute",
          width: "100%",
          left: "0",
          right: "0",
          margin: "auto",
          marginLeft: "15.25rem",
          transition: "width 0.1s",
        },
      }}
    >
      <InputLeftElement>
        <Search />
      </InputLeftElement>
      <Input
        variant="filled"
        placeholder={`Search near ${currentUser?.city}`}
        onChange={handleInputChange}
        value={currentSearchQuery}
      />
    </InputGroup>
  );
}
