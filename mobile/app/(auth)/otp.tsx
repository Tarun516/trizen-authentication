import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { verifyOtp } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import AuthInput from "../../components/AuthInput";
import AuthButton from "../../components/AuthButton";
import { COLORS } from "../theme/colors";

export default function OtpScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes = 300s
  const { setAccessToken } = useAuth();

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!otp) return setError("Please enter the OTP");
    try {
      setLoading(true);
      const res = await verifyOtp(email, otp);
      // @ts-ignore
      setAccessToken(res.accessToken);
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email 📩</Text>
      <Text style={styles.subtitle}>
        We’ve sent a 6-digit OTP to <Text style={styles.email}>{email}</Text>
      </Text>

      <AuthInput
        label="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <AuthButton
        title={loading ? "Verifying..." : "Verify OTP"}
        onPress={handleVerify}
      />

      <Text style={styles.timer}>
        {timer > 0 ? (
          <>
            Expires in{" "}
            <Text style={{ color: COLORS.primary }}>{formatTime(timer)}</Text>
          </>
        ) : (
          <Text style={{ color: COLORS.danger }}>OTP expired ⏰</Text>
        )}
      </Text>

      <Text
        style={styles.resend}
        onPress={() => {
          setTimer(300);
          setError("");
          // optional: re-hit signup to resend OTP
        }}
      >
        Didn’t receive code?{" "}
        <Text style={{ color: COLORS.primary }}>Resend OTP</Text>
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
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 24,
  },
  email: {
    fontWeight: "600",
    color: COLORS.primary,
  },
  error: {
    color: COLORS.danger,
    marginBottom: 10,
  },
  timer: {
    textAlign: "center",
    marginTop: 10,
    color: COLORS.text,
  },
  resend: {
    textAlign: "center",
    marginTop: 12,
    color: COLORS.text,
  },
});
