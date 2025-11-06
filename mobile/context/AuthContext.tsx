import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

interface AuthContextType {
  accessToken: string | null;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  setToken: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const setToken = async (token: string) => {
    await AsyncStorage.setItem("accessToken", token);
    setAccessToken(token);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("accessToken");
    setAccessToken(null);
    router.replace("/(auth)/signin");
  };

  // auto-login on app open
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
        router.replace("/dashboard");
      } else {
        router.replace("/(auth)/signin");
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
