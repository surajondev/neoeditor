import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Input from "../components/Input";
import { router } from "expo-router";

type ResetPasswordScreenProps = {
  navigation: NativeStackNavigationProp<any, any>;
  route: RouteProp<any, any>;
};

type EmailState = {
  value: string;
  error: string;
};

export default function ResetPassword({
  navigation,
}: ResetPasswordScreenProps) {
  const [email, setEmail] = useState<EmailState>({ value: "", error: "" });

  const sendResetPasswordEmail = () => {
    if (!email.value.includes("@")) {
      setEmail({ ...email, error: "Please enter a valid email address." });
      return;
    }

    Alert.alert("Success", "Password reset email sent. Go to login page.", [
      { text: "OK", onPress: () => router.push("/login") },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        <BackButton goBack={() => router.push("/login")} />
      </View>
      <Text style={styles.header}>Reset your password</Text>
      <Input
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={(text: string) =>
          setEmail({ value: text, error: email.error })
        }
        value={email.value}
        type="email"
        placeholder="Email"
        secureTextEntry={false} // Not needed for email input
        description="You will receive an email with the reset link."
      />
      {email.error ? <Text style={styles.errorText}>{email.error}</Text> : null}
      <Text style={styles.info}>
        {" "}
        You will receive an email with the reset link.
      </Text>
      <Button title="Continue" onPress={sendResetPasswordEmail} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 10,
  },
  backButton: {
    marginBottom: 60,
  },
  info: {
    fontSize: 16,
    fontFamily: "inter",
    fontWeight: "bold",
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    marginTop: 8,
    marginBottom: 8,
    fontSize: 16,
  },
});
