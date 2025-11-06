import React, { createContext, useState, useContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setAccessToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);

  const setAccessToken = async (token: string | null) => {
    setAccessTokenState(token);
    if (token) await AsyncStorage.setItem("accessToken", token);
    else await AsyncStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
