import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { signup } from "../../lib/api";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";
import { COLORS } from "../theme/colors";

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!email || !password || !confirm)
      return setError("All fields are required");

    if (password !== confirm) return setError("Passwords do not match");

    try {
      setLoading(true);
      await signup(email, password);
      router.push({ pathname: "/(auth)/otp", params: { email } });
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account ✨</Text>
      <Text style={styles.subtitle}>Join Trizen and start exploring</Text>

      <AuthInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <AuthInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <AuthInput
        label="Confirm Password"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AuthButton
        title={loading ? "Signing up..." : "Sign Up"}
        onPress={handleSignup}
      />

      <Text style={styles.switchText}>
        Already have an account?{" "}
        <Text
          style={{ color: COLORS.primary }}
          onPress={() => router.push("/(auth)/signin")}
        >
          Sign In
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
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 20,
  },
  error: {
    color: COLORS.danger,
    marginVertical: 8,
  },
  switchText: {
    textAlign: "center",
    marginTop: 20,
    color: COLORS.text,
  },
});
