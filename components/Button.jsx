import { StyleSheet, Text, Pressable } from "react-native";
import React from "react";

const Button = ({
  buttonStyle = {}, // Optional with default empty object
  textStyle = {}, // Optional with default empty object
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = true,
  disabled = false,

}) => {
  const shadowStyle = {
    shadowColor: "#3e3e3e",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4, // Adds shadow for Android
  };

  const combinedStyles = [
    styles.button,
    buttonStyle,
    hasShadow && shadowStyle,
    disabled && styles.disabledButton,
  ];

  return (
    <Pressable
      onPress={!disabled && !loading ? onPress : undefined}
      style={combinedStyles}
    >
      <Text style={[styles.text, textStyle]}>
        {loading ? "Loading..." : title}
      </Text>
    </Pressable>
  );
};


export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#00c26f",
    height: 60, // Fixed height in pixels
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
    top: 10,
  },
  disabledButton: {
    backgroundColor: "#a9a9a9", // Gray color for disabled state
  },
  text: {
    color: "white",
    fontSize: 20, // Font size in pixels
    fontFamily: "Inter",
    fontWeight: "bold",
  },
});
