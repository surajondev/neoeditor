import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Video } from "expo-av";
import { useGlobalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";

interface VideoEditorProps {
  route: any;
  navigation: any;
}

const VideoEditor: React.FC<VideoEditorProps> = () => {
  const { videoUri }: { videoUri: string } = useGlobalSearchParams();
  const newUri = `${FileSystem.documentDirectory}video.mp4`;

  const videoRef = useRef(null); // Create a ref for the video player
  const [isPlaying, setIsPlaying] = useState(true); // Set initial state to true for default play
  const [videoStatus, setVideoStatus] = useState<any>(null); // To track the video status

  // Play/Pause button handler
  const togglePlayPause = () => {
    if (isPlaying) {
      console.log(videoUri);
      //@ts-ignore
      videoRef.current.pauseAsync(); // Pause the video
    } else {
      //@ts-ignore
      videoRef.current.playAsync(); // Play the video
    }
    setIsPlaying(!isPlaying);
  };

  // Format video length (seconds to mm:ss)
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const convert = async () => {
    await FileSystem.copyAsync({
      from: videoUri,
      to: newUri,
    });
  };

  useEffect(() => {
    convert();
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{
          uri: newUri,
        }}
        style={styles.video}
        useNativeControls
        //@ts-ignore
        resizeMode="contain"
        shouldPlay={true} // Automatically play the video
        isMuted={true} // Mute the video by default
        onPlaybackStatusUpdate={(status) => setVideoStatus(status)}
        onLoad={() => console.log("Video loaded")}
        // onError={(error) => console.error("Video error:", error)}
      />

      {/* Display video length */}
      <Text style={styles.lengthText}>
        {videoStatus?.durationMillis
          ? `Duration: ${formatDuration(videoStatus.durationMillis / 1000)}`
          : "Loading..."}
      </Text>

      {/* Play/Pause button */}
      <TouchableOpacity
        style={styles.playPauseButton}
        onPress={togglePlayPause}
      >
        <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>

      {/* Example of editing options - Implement trim, rotate, or other features */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          Alert.alert(
            "Editing Feature",
            "This is where editing functionality can go!"
          )
        }
      >
        <Text style={[styles.buttonText, { color: "black" }]}>Edit Video</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  video: {
    width: "100%",
    height: 300,
  },
  lengthText: {
    fontSize: 18,
    marginTop: 10,
    color: "white",
  },
  playPauseButton: {
    backgroundColor: "#00629f",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  editButton: {
    backgroundColor: "#d9e2ff",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});

export default VideoEditor;
