import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { signin } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { COLORS } from "../theme/colors";

export default function SigninScreen() {
  const { setAccessToken } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignin = async () => {
    if (!email || !password) return setError("All fields are required");
    try {
      const res = await signin(email, password);
      // @ts-ignore
      setAccessToken(res.accessToken);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>
      <AuthInput label="Email" value={email} onChangeText={setEmail} />
      <AuthInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AuthButton title="Login" onPress={handleSignin} />
      <Text style={styles.switchText}>
        Don’t have an account?{" "}
        <Text
          style={{ color: COLORS.primary }}
          onPress={() => router.push("/(auth)/signup")}
        >
          Sign Up
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 20,
  },
  error: {
    color: COLORS.danger,
    marginBottom: 10,
  },
  switchText: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.text,
  },
});
