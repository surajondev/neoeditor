import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { supabase } from "../lib/supabase";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import Input from "../components/Input";
import Button from "../components/Button";
import { useFonts } from "expo-font";
import { FontAwesome } from "@expo/vector-icons";
import { Appearance } from "react-native";
import BackButton from "../components/BackButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();

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

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert("Please fill all the fields");
      return;
    }
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
          <BackButton goBack={() => router.push("/")} />
          <Text style={styles.wlc}>Hey,</Text>
          <Text style={styles.wlc}>Welcome Back</Text>
          <TouchableOpacity onPress={() => router.push("/Register")}>
            <Text style={styles.footertext}>
              Don't have an account!{" "}
              <Text style={{ color: "#00c26f", fontWeight: "bold" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
          <Text style={styles.info}>Please login to continue</Text>
          <View style={styles.verticallySpaced}>
            <Input
              leftIcon={{ type: "font-awesome", name: "envelope" }}
              onChangeText={(text: string) => setEmail(text)}
              value={email}
              type="text"
              placeholder="Email"
              secureTextEntry={false}
              description={""}
            />
            <Input
              leftIcon={{ type: "font-awesome", name: "lock" }}
              onChangeText={(text: string) => setPassword(text)}
              value={password}
              secureTextEntry={true}
              type="password"
              placeholder="Password"
              description={""}
            />
          </View>
          <TouchableOpacity onPress={() => router.push("/ResetPassword")}>
            <Text style={styles.forgetPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.verticallySpaced}>
            <Button
              title={loading ? "Logging in..." : "Login"}
              disabled={loading}
              onPress={signInWithEmail}
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
    padding: 10,
    marginTop: 10,
  },
  info: {
    fontSize: 15,
    fontFamily: "inter",
    fontWeight: "medium",
    marginBottom: 15,
    marginLeft: 8,
    marginTop: 15,
  },
  forgetPassword: {
    fontSize: 15,
    fontFamily: "inter",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 270,
  },
  wlc: {
    fontSize: 30,
    fontFamily: "inter",
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 8,
  },
  verticallySpaced: {
    display: "flex",
    flexDirection: "column",
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
    top: 350, // Ensures it's at the bottom of the screen
    left: 0,
    right: 0, // Centers the text horizontally
    fontFamily: "inter",
    fontSize: 16,
    textAlign: "center", // Centers text
    color: "black",
  },
});
