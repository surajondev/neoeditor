import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Reusable Loader Component
function Loader() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Check and restore session from AsyncStorage
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem("user_session");
        if (storedSession) {
          setSession(JSON.parse(storedSession));
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error);
          setSession(null);
        } else if (session) {
          setSession(session);
          await AsyncStorage.setItem("user_session", JSON.stringify(session));
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_, currentSession) => {
        setSession(currentSession);
        if (currentSession) {
          await AsyncStorage.setItem(
            "user_session",
            JSON.stringify(currentSession)
          );
        } else {
          await AsyncStorage.removeItem("user_session");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (loading || !loaded) {
    return <Loader />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name={session ? "index" : "login"}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="VideoEditor" options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ headerShown: false }} />
        <Stack.Screen name="start" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
