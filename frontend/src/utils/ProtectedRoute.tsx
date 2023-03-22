import { useEffect } from "react";
import { AppHeader } from "../components";
import { useAuth } from "../context";

type Props = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: Props) => {
  const { tryToPersistSession, userPersists } = useAuth();

  useEffect(() => {
    if (!userPersists) tryToPersistSession();
  }, [tryToPersistSession, userPersists]);

  return (
    <>
      <AppHeader />
      {children}
    </>
  );
};
