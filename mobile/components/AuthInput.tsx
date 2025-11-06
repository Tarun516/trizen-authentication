import React from "react";
import { TextInput } from "react-native-paper";
import { COLORS } from "../app/theme/colors";

export default function AuthInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
}) {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      style={{ marginVertical: 8 }}
      outlineColor="#CBD5E1"
      activeOutlineColor={COLORS.primary}
    />
  );
}
