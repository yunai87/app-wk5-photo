import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [resultText, setResultText] = useState("");

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("需要權限", "請允許存取相簿，才能選擇照片。");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setResultText("");
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("需要權限", "請允許使用相機，才能拍照。");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setResultText("");
    }
  };

  const uploadPhoto = async () => {
    if (!imageUri) {
      Alert.alert("尚未選擇照片", "請先選擇或拍攝一張照片。");
      return;
    }

    try {
      setUploading(true);
      setResultText("");

      await new Promise((resolve) => {
        setTimeout(resolve, 1200);
      });

      setResultText("上傳完成");
    } catch {
      setResultText("上傳失敗：請稍後再試。");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>手機照片上傳</Text>
        <Text style={styles.subtitle}>可從相簿選圖或直接拍照後上傳</Text>

        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>從相簿選擇</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.buttonText}>拍一張照片</Text>
          </TouchableOpacity>
        </View>

        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyPreviewText}>尚未選擇照片</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.disabledButton]}
          onPress={uploadPhoto}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.uploadButtonText}>上傳照片</Text>
          )}
        </TouchableOpacity>

        {resultText ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>上傳結果</Text>
            <Text style={styles.resultText}>{resultText}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f5f7",
  },
  content: {
    padding: 20,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "#334155",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  preview: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    backgroundColor: "#d1d5db",
  },
  emptyPreview: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPreviewText: {
    color: "#6b7280",
  },
  uploadButton: {
    marginTop: 4,
    backgroundColor: "#0f766e",
    borderRadius: 12,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    opacity: 0.7,
  },
  uploadButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  resultBox: {
    marginTop: 6,
    borderRadius: 10,
    borderColor: "#cbd5e1",
    borderWidth: 1,
    backgroundColor: "#ffffff",
    padding: 12,
    gap: 6,
  },
  resultTitle: {
    fontWeight: "700",
    color: "#0f172a",
  },
  resultText: {
    color: "#334155",
    fontSize: 12,
  },
});
