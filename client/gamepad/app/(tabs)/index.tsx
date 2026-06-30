import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [ip, setIp] = useState("");
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const conectar = () => {
    const ipLimpia = ip.replace(":3000", "");
    const newSocket = new WebSocket(`ws://${ipLimpia}:3000/ws`);

    newSocket.onopen = () => {
      console.log("✅ Conectado");
      setConnected(true);
    };

    newSocket.onerror = (e) => {
      console.log("❌ Error:", JSON.stringify(e));
    };

    newSocket.onclose = (e) => {
      console.log("🔴 Cerrado:", e.code, e.reason);
      setConnected(false);
    };

    setSocket(newSocket);
  };

  const enviarInput = (key: string, state: "down" | "up") => {
    console.log("¿Qué vale socket cuando toco el botón?:");
    socket?.send(JSON.stringify({ type: "input", key, state }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pico Park Controller 🎮</Text>
      <TextInput
        style={styles.input}
        placeholder="192.168.1.15"
        value={ip}
        onChangeText={setIp}
      />
      <Pressable style={styles.connectButton} onPress={conectar}>
        <Text style={styles.whiteText}>Conectar</Text>
      </Pressable>
      <Text style={{ marginBottom: 20 }}>
        {connected ? "🟢 Conectado" : "🔴 Desconectado"}
      </Text>
      <View style={styles.gamepad}>
        <View style={styles.dpad}>
          <Pressable
            style={styles.button}
            onPressIn={() => enviarInput("jump", "down")}
          >
            <Text style={styles.buttonText}>↑</Text>
          </Pressable>
          <View style={styles.row}>
            <Pressable
              style={styles.button}
              onPressIn={() => enviarInput("left", "down")}
              onPressOut={() => enviarInput("left", "up")}
            >
              <Text style={styles.buttonText}>←</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPressIn={() => enviarInput("right", "down")}
              onPressOut={() => enviarInput("right", "up")}
            >
              <Text style={styles.buttonText}>→</Text>
            </Pressable>
          </View>
        </View>
        <Pressable
          style={styles.jumpButton}
          onPressIn={() => enviarInput("jump", "down")}
        >
          <Text style={styles.jumpText}>A</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  connectButton: {
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  whiteText: {
    color: "white",
    fontWeight: "bold",
  },
  gamepad: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  dpad: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
  },
  button: {
    width: 80,
    height: 80,
    backgroundColor: "#ddd",
    margin: 5,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 30,
    fontWeight: "bold",
  },
  jumpButton: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#e74c3c",
    justifyContent: "center",
    alignItems: "center",
  },
  jumpText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
});
