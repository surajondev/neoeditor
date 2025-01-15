import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const Input = ({
  leftIcon,
  onChangeText,
  value,
  placeholder,
  type,
  secureTextEntry,
  description,
}) => {
  return (
    <View style={styles.inputContainer}>
      <FontAwesome name={leftIcon.name} size={20} color="#7c7c7c" />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        type={type}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    borderRadius: 22,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignSelf: "stretch",
    gap: 2,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 5,
    flex: 1,
  },
});

export default Input;
