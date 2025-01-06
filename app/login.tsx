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
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [fontsLoaded] = useFonts({
    MedulaOne: require("../assets/fonts/MedulaOne-Regular.ttf"),
  });
  const router = useRouter();

  if (!fontsLoaded) {
    return null;
  }

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      Alert.alert("Login Error", "Please check your email and password.");
      setLoading(false);
      return;
    }
    router.push("/start");
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.logo}>WESHOT</Text>
          <View style={[styles.verticallySpaced, styles.mt20]}>
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
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <Button
              title={loading ? "Logging in..." : "Login"}
              disabled={loading}
              onPress={signInWithEmail}
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
  mt20: {
    marginTop: 20,
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
    fontSize: 18,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 61,
    textAlign: "center",
    backgroundColor: "#007BFF",
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
