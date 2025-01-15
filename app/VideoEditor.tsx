import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { useGlobalSearchParams } from "expo-router";
import * as FileSystem from "expo-file-system";

const VideoEditor: React.FC = () => {
  const { videoUri }: { videoUri: string } = useGlobalSearchParams();

  const [isPlaying, setIsPlaying] = useState(true);
  const [duration, setDuration] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Directly use the videoUri passed from ImagePicker or any other source
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = false;
    player.play();
  });

  // Add event listener for 'loadedmetadata'
  useEffect(() => {
    //@ts-ignore
    const subscription = player.addListener("loadedmetadata", () => {
      setDuration(player.duration);
    });
    setLoading(false);

    return () => {
      subscription.remove(); // Clean up listener
    };
  }, [player]);

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  // No need for a file conversion or copy step now
  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        //@ts-ignore
        resizeMode="contain"
        useNativeControls
      />
      <Text style={styles.lengthText}>
        {loading
          ? "Loading..."
          : duration !== null
          ? `Duration: ${formatDuration(duration)}`
          : "Duration not available"}
      </Text>
      <TouchableOpacity
        style={styles.playPauseButton}
        onPress={togglePlayPause}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
      </TouchableOpacity>
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
