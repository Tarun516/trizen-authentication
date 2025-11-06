import React from "react";
import { Button } from "react-native-paper";
import { COLORS } from "../app/theme/colors";

export default function AuthButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={{
        marginVertical: 10,
        borderRadius: 50,
        paddingVertical: 4,
        backgroundColor: COLORS.primary,
      }}
      labelStyle={{ color: COLORS.white, fontSize: 16 }}
    >
      {title}
    </Button>
  );
}
