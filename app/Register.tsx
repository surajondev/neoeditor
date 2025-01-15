import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  StatusBar as RNStatusBar,
} from "react-native";
import { supabase } from "../lib/supabase";
import Input from "../components/Input";
import { useFonts } from "expo-font";
import { router, useRouter } from "expo-router";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { Appearance } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Register() {
  const [fontsLoaded] = useFonts({
    MedulaOne: require("../assets/fonts/MedulaOne-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    // Force light mode across platforms
    Appearance.setColorScheme("light");
  }, []);

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function RegisterAuth() {
    if (!email || !password || !username) {
      Alert.alert("Please fill all the fields");
      return;
    }
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
      setLoading(true);
      Alert.alert(error.message);
      return;
    }
    setLoading(false);
    Alert.alert("You are registered successfully!");
    //@ts-ignore
    router.push("/login");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <BackButton goBack={() => router.push("/")} />
          <Text style={styles.logo}>WESHOT</Text>
          <Text style={styles.wlc}>Let's</Text>
          <Text style={styles.wlc}>Get Started</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.footertext}>
              Already have an account!{" "}
              <Text style={{ color: "#00c26f", fontWeight: "bold" }}>
                Login
              </Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.info}>
            Please fill the details to create an account
          </Text>
          <View style={styles.verticallySpaced}>
            <Input
              leftIcon={{ type: "font-awesome", name: "user" }}
              onChangeText={(text: string) => setUsername(text)}
              value={username}
              type="text"
              placeholder="Username"
              secureTextEntry={false}
              description={""}
            />
            <Input
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text: string) => setEmail(text)}
              value={email}
              type="email"
              placeholder="Email"
              secureTextEntry={true}
              description={""}
            />
            <Input
              leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              type={password}
              secureTextEntry={true}
              placeholder="Password"
              description={""}
            />
          </View>
          <View style={styles.verticallySpaced}>
            <Button title="Sign in" disabled={loading} onPress={RegisterAuth} />
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
    padding: 10,
    marginTop: 10,
  },
  info: {
    fontSize: 15,
    fontFamily: "inter",
    fontWeight: "medium",
    marginBottom: 15,
    marginLeft: 10,
    marginTop: 15,
  },
  wlc: {
    fontSize: 30,
    fontFamily: "inter",
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  verticallySpaced: {
    display: "flex",
    flexDirection: "column",
    marginBottom: 30,
    gap: 20,
  },
  logo: {
    fontSize: 50,
    color: "black",
    textAlign: "center",
    fontFamily: "MedulaOne",
    alignSelf: "center",
    marginBottom: 50,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  footertext: {
    position: "absolute",
    top: 400, // Ensures it's at the bottom of the screen
    left: 0,
    right: 0, // Centers the text horizontally
    fontFamily: "inter",
    fontSize: 16,
    textAlign: "center", // Centers text
    color: "black",
  },
});
