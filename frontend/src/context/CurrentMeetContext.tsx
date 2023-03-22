import { createContext, useContext } from "react";
import { useCookies } from "react-cookie";
import { TMeet } from "../types";

type CurrentMeetContextProps = {
  currentMeetCookie: TMeet | null;
  setCurrentMeetCookie: (medicionActual: TMeet) => void;
};

const CurrentMeetContext = createContext<CurrentMeetContextProps>(null!);

type Props = {
  children: React.ReactNode;
};

const CurrentMeetProvider = ({ children }: Props) => {
  const [cookies, setCookie] = useCookies(["currentMeet"]);

  const currentMeetCookie: TMeet | null = cookies?.currentMeet;

  const setCurrentMeetCookie = (medicionActual: TMeet) => {
    setCookie("currentMeet", medicionActual, { path: "/" });
  };

  return (
    <CurrentMeetContext.Provider
      value={{ currentMeetCookie, setCurrentMeetCookie }}
    >
      {children}
    </CurrentMeetContext.Provider>
  );
};

export const useCurrentMeet = () => useContext(CurrentMeetContext);
export { CurrentMeetContext, CurrentMeetProvider };
