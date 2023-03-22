import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { showNotification } from "@mantine/notifications";
import { useLocation, useNavigate } from "react-router-dom";

import { tokenService } from "../api";
import { clientService } from "../api/services/client-service";

type AuthContextProps = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  authRequest: (req: any, params?: any) => Promise<any>;
  // userInfo: TUserInfo;
  userPersists: boolean;
  tryToPersistSession: () => void;
  tryingToPersistSession: boolean;
  authCallbackOnPageLoad: (effect: React.EffectCallback) => void;
};

const AuthContext = createContext<AuthContextProps>(null!);

type Props = {
  children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [tryingToPersistSession, setTryingToPersistSession] = useState(false);
  const [userPersists, setUserPersists] = useState<boolean>(null!);

  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true);
      try {
        const response = await tokenService.generateTokens(username, password);
        tokenService.setTokensToLC(response.data);
        //   const responseClientData = await clientService.info.get();
        //   setUserInfo(responseClientData.data);
        setUserPersists(true);
        navigate("/my-meets");
      } catch {
        showNotification({
          title: "Error",
          message: "Email o contraseña incorrectos.",
          color: "red",
        });
      }
      setLoading(false);
    },
    [navigate]
  );

  const logout = useCallback(() => {
    tokenService.removeTokens();
    navigate("/");
  }, [navigate]);

  const tryToPersistSession = useCallback(() => {
    setLoading(true);
    setTryingToPersistSession(true);
    clientService.heartbeat
      .get()
      .then((response) => {
        //   setUserInfo(response.data);
        setUserPersists(true);
        if (location.pathname === "/") {
          navigate("/my-meets");
        }
      })
      .catch((error) => {
        logout();
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
        setTryingToPersistSession(false);
      });
  }, [location.pathname, logout, navigate]);

  const authRequest = useCallback(
    async (req: any, params?: any) => {
      try {
        if (params) {
          const response = await req(params);
          return response;
        } else {
          const response = req();
          return response;
        }
      } catch {
        logout();
      }
    },
    [logout]
  );

  useEffect(() => {
    if (location.pathname === "/" && tokenService.getTokenFromLC("refresh")) {
      tryToPersistSession();
    }
  }, [location.pathname, tryToPersistSession]);

  const authCallbackOnPageLoad = useCallback(
    (effect: React.EffectCallback) => {
      if (!tryingToPersistSession) {
        setLoading(true);
        effect();
        setLoading(false);
      }
    },
    [tryingToPersistSession]
  );

  return (
    <AuthContext.Provider
      value={{
        userPersists,
        login,
        logout,
        loading,
        setLoading,
        authRequest,
        tryToPersistSession,
        tryingToPersistSession,
        authCallbackOnPageLoad,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext, AuthProvider };
export type { AuthContextProps };
