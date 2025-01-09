import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
};

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    MedulaOne: require("../assets/fonts/MedulaOne-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter_28pt-Regular.ttf"), // Ensure this font is added
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  async function handlelogin() {
    router.push("/login");
  }

  async function handleSignIn() {
    router.push("/Register");
  }

  return (
    <ImageBackground
      source={require("../assets/images/loginbg.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.logo}>WESHOT</Text>
        <Text style={styles.welcomeText}>
          Create cinematic videos that{"\n"}blow minds.
        </Text>

        {/* Replace the SVG icon */}
        <Image
          style={styles.playButton}
          source={require("../assets/images/play.svg")} // Ensure this asset exists
        />

        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.buttonLogin} onPress={handlelogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonSignIn} onPress={handleSignIn}>
            <Text style={styles.buttonTextSignIn}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  logo: {
    position: "absolute",
    top: 50,
    fontSize: 68,
    color: "white",
    textAlign: "center",
    fontFamily: "MedulaOne",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  welcomeText: {
    position: "absolute",
    bottom: 220,
    fontSize: 20,
    color: "white",
    textAlign: "center",
    fontFamily: "InterMedium",
  },
  authButtons: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonLogin: {
    borderRadius: 50,
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  buttonSignIn: {
    borderRadius: 50,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
  },
  buttonTextSignIn: {
    color: "white",
    fontSize: 18,
  },
  playButton: {
    marginTop: 40,
    width: 50, // Adjust size based on your asset
    height: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
