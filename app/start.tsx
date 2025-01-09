import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker"; // Import ImagePicker
import { useFonts } from "expo-font";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

// Define the types for navigation parameters
type RootStackParamList = {
  VideoEditor: { videoUri: string };
  ProjectManager: { videoUris: string[] };
  Home: undefined; // Add Home to navigation types
};

// Use the navigation type for navigation hooks
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeActivity() {
  const [fontsLoaded] = useFonts({
    MedulaOne: require("../assets/fonts/MedulaOne-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return null;
  }
  const router = useRouter();
  const navigation = useNavigation<NavigationProp>(); // Use typed navigation

  // Function to sign out the user
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Error", "Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    } else {
      Alert.alert("Signed Out", "You have successfully signed out.");
      router.push("/");
    }
  };

  // Function to select a single video
  const selectSingleVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      selectionLimit: 1,
    });

    if (result.canceled) {
      Alert.alert("Selection canceled");
    } else {
      const videoUri = result.assets?.[0].uri;
      console.log(videoUri);
      if (videoUri) {
        router.push(`/VideoEditor?videoUri=${encodeURIComponent(videoUri)}`);
      }
    }
  };

  const selectMultipleVideos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your media library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      allowsMultipleSelection: true,
    });

    if (result.canceled) {
      Alert.alert("Selection canceled");
    } else if (result.assets && result.assets.length === 2) {
      const videoUris = result.assets.map((asset) => asset.uri);
      navigation.navigate("ProjectManager", { videoUris });
    } else {
      Alert.alert("Error", "Please select exactly two videos.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>WESHOT</Text>
        <TouchableOpacity style={styles.videoButton} onPress={signOut}>
          <Text style={[styles.buttonText, styles.videoButtonText]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.selectFileText}>Select a file to edit</Text>

      <TouchableOpacity style={styles.videoButton} onPress={selectSingleVideo}>
        <Text style={[styles.buttonText, styles.videoButtonText]}>Video</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.projectButton}
        onPress={selectMultipleVideos}
      >
        <Text style={styles.buttonText}>Project</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#ffffff",
    paddingTop: 32,
  },
  header: {
    flexDirection: "row", // Arrange Text and Icon in a row
    alignItems: "center",
    marginBottom: 150,
  },
  appName: {
    fontSize: 40,
    color: "#000000",
    fontFamily: "MedulaOne", // Ensure you've added the font correctly
    textShadowColor: "#000",
    textShadowRadius: 5,
    marginTop: 20,
    marginRight: 200, // Space between text and icon
  },
  icon: {
    borderWidth: 3, // Border width around the icon
    borderColor: "#000", // Border color
    borderRadius: 100, // Makes it circular
    marginTop: 20,
    padding: 10, // Space inside the border around the icon
  },
  selectFileText: {
    fontSize: 34,
    textAlign: "center",
    marginTop: 32,
  },
  videoButton: {
    backgroundColor: "#00629f", // Replace with your button background color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 50,
  },
  projectButton: {
    backgroundColor: "#d9e2ff", // Replace with your button background color
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
  },
  videoButtonText: {
    color: "white",
  },
});
