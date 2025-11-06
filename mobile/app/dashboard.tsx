import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { COLORS } from "./theme/colors";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardScreen() {
  const { setAccessToken } = useAuth();

  const handleLogout = async () => {
    await setAccessToken(null);
    await AsyncStorage.removeItem("accessToken");
    router.replace("/(auth)/signin");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 🎉</Text>
      <Text style={styles.subtitle}>You’re logged in successfully!</Text>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={{ color: COLORS.white }}
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  title: { fontSize: 28, fontWeight: "700", color: COLORS.text },
  subtitle: { fontSize: 16, color: "#475569", marginBottom: 20 },
  logoutButton: {
    borderRadius: 40,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
});
