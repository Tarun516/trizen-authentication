import { Stack, router } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { COLORS } from "./theme/colors";

function NavigationManager() {
  const { accessToken, setAccessToken } = useAuth();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("accessToken");
      if (token) {
        setAccessToken(token);
        router.replace("/dashboard");
      } else {
        router.replace("/(auth)/signin");
      }
    };
    checkToken();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/signin" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="(auth)/otp" />
      <Stack.Screen name="dashboard" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaperProvider
        theme={{
          colors: {
            primary: COLORS.primary,
            background: COLORS.background,
            onSurface: COLORS.text,
          },
        }}
      >
        <NavigationManager />
      </PaperProvider>
    </AuthProvider>
  );
}
