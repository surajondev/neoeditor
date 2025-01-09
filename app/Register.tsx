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
import { router, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import input from "../components/input";

export default function Register() {
  const [fontsLoaded] = useFonts({
    MedulaOne: require("../assets/fonts/MedulaOne-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Text style={styles.logo}>WESHOT</Text>
          <Text style={styles.wlc}>Let's</Text>
          <Text style={styles.wlc}>Get Started</Text>
          <Text style={styles.info}>
            Please Fill the details to create an account
          </Text>
          <View style={styles.verticallySpaced}>
            <Input
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
    padding: 10,
    marginTop: 10,
  },
  info: {
    fontSize: 15,
    fontFamily: "inter",
    fontWeight: "medium",
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 20,
  },
  wlc: {
    fontSize: 30,
    fontFamily: "inter",
    fontWeight: "bold",
    marginBottom: 10,
    marginLeft: 10,
  },
  verticallySpaced: {
    paddingVertical: 7,
    alignSelf: "stretch",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#7c7c7c",
    borderRadius: 22,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    gap: 12,
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 5,
  },
  button: {
    backgroundColor: "#00c26e",
    fontSize: 20,
    fontWeight: "bold",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 61,
    shadowColor: "black",
    textAlign: "center",
    shadowOpacity: 0.8,
    elevation: 6,
    shadowRadius: 15,
    shadowOffset: { width: 56, height: 13 },
    borderWidth: 0,
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
