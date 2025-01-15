import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";
import { useRouter } from "expo-router";

export default function HomeActivity() {
  const router = useRouter();

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

  const ensureDirectoryExists = async () => {
    const videoDir = `${FileSystem.documentDirectory}videos/`;
    const dirInfo = await FileSystem.getInfoAsync(videoDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(videoDir, { intermediates: true });
    }
    return videoDir;
  };

  const processVideo = async (uri: string) => {
    try {
      // Get video file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("Video file not found");
      }

      // Create videos directory if it doesn't exist
      const videoDir = await ensureDirectoryExists();

      // Generate a unique filename using timestamp
      const timestamp = new Date().getTime();
      const extension = uri.split(".").pop();
      const fileName = `video_${timestamp}.${extension}`;
      const destinationUri = `${videoDir}${fileName}`;

      // Copy the video file to our app's document directory
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });

      // Verify the copied file exists
      const newFileInfo = await FileSystem.getInfoAsync(destinationUri);
      if (!newFileInfo.exists) {
        throw new Error("Failed to copy video file");
      }

      return destinationUri;
    } catch (error) {
      console.error("Video processing error:", error);
      throw error;
    }
  };

  const selectSingleVideo = async () => {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need access to your media library."
        );
        return;
      }

      // Launch picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const videoUri = result.assets[0].uri;
        const processedUri = await processVideo(videoUri);

        // Navigate with the processed URI
        router.push({
          pathname: "/VideoEditor",
          params: { videoUri: processedUri },
        });
      }
    } catch (error) {
      console.error("Video selection error:", error);
      Alert.alert("Error", "Failed to process the video. Please try again.");
    }
  };

  const selectMultipleVideos = async () => {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "We need access to your media library."
        );
        return;
      }

      // Launch picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!result.canceled && result.assets) {
        if (result.assets.length !== 2) {
          Alert.alert("Selection Error", "Please select exactly two videos.");
          return;
        }

        // Process both videos
        const processedUris = await Promise.all(
          result.assets.map((asset) => processVideo(asset.uri))
        );

        // Navigate with processed URIs
        router.push({
          // @ts-ignore
          pathname: "/ProjectManager",
          params: { videoUris: JSON.stringify(processedUris) },
        });
      }
    } catch (error) {
      console.error("Video selection error:", error);
      Alert.alert("Error", "Failed to process the videos. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>WESHOT</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 150,
  },
  appName: {
    fontSize: 40,
    color: "#000000",
    fontFamily: "MedulaOne",
    textShadowColor: "#000",
    textShadowRadius: 5,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: "#00629f",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  selectFileText: {
    fontSize: 34,
    textAlign: "center",
    marginTop: 32,
  },
  videoButton: {
    backgroundColor: "#00629f",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 50,
  },
  projectButton: {
    backgroundColor: "#d9e2ff",
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
