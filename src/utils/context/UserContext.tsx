import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from "react";

// ---------------- Types -----------------

export interface UserData {
  email: string;
  name?: string;
  id?: string | number;
  avatar?: string;
}

export interface UserContextType {
  user: UserData | null;
  setUser: (data: UserData) => void;
  clearUser: () => void;
}

// -------------- Context ------------------

const UserContext = createContext<UserContextType | undefined>(undefined);

// -------------- Provider ------------------

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUserState] = useState<UserData | null>(null);

  const setUser = (data: UserData) => {
    setUserState(data);
  };

  const clearUser = () => {
    setUserState(null);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      clearUser,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// -------------- Hook ----------------------

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within <UserProvider>");
  }
  return context;
};
