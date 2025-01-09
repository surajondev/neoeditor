import { StyleSheet, View, Text, TextInput } from "react-native";
import { hp, wp, theme } from "../theme";
import React from "react";

const input = (props) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={{ flex: 1 }}
        placeholderTextColor={theme.colors.textLight}
      />
    </View>
  );
};

export default input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: hp(7, 2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#black",
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
});
