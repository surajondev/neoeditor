import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import { router, useRouter } from "expo-router";

export default function Register() {
  const [fontsLoaded] = useFonts({
    MedulaOne: require("../assets/fonts/MedulaOne-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  async function RegisterAuth() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        //@ts-ignore
        first_name: username,
      },
    });

    if (error) {
      Alert.alert(error.message);
      return;
    }
    setLoading(false);
    Alert.alert("You are registered successfully!");
    //@ts-ignore
    router.push("Login");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.logo}>WESHOT</Text>
          <View style={styles.verticallySpaced}>
            <Input
              label="Name"
              leftIcon={{ type: "font-awesome", name: "user" }}
              onChangeText={(text) => setUsername(text)}
              value={username}
              placeholder="Username"
              autoCapitalize={"none"}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Input
              label="Email"
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholder="email@address.com"
              autoCapitalize={"none"}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Input
              label="Password"
              leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              placeholder="Password"
              autoCapitalize={"none"}
              inputContainerStyle={styles.inputContainer}
              inputStyle={styles.input}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Button
              title="Sign in"
              disabled={loading}
              onPress={RegisterAuth}
              buttonStyle={styles.button}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 20,
    marginTop: 10,
  },
  verticallySpaced: {
    paddingVertical: 8,
    alignSelf: "stretch",
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  input: {
    padding: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    fontSize: 18,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 61,
    textAlign: "center",
  },
  logo: {
    fontSize: 68,
    color: "black",
    textAlign: "center",
    fontFamily: "MedulaOne",
    alignSelf: "center",
    marginBottom: 100,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});
