import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";

import { io } from "socket.io-client";
import { useKeepAwake } from "expo-keep-awake";

export default function HomeScreen() {
  useKeepAwake();

  const [ip, setIp] = useState("");
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<any>(null);

  const connect = () => {
    const newSocket = io(`http://${ip}`);

    newSocket.on("connect", () => {
      setConnected(true);
      console.log("Conectado");
    });

    newSocket.on("disconnect", () => {
      setConnected(false);
      console.log("Desconectado");
    });

    setSocket(newSocket);
  };

  const sendInput = (data: any) => {
    socket?.emit("input", data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pico Park Controller 🎮</Text>

      <TextInput
        style={styles.input}
        placeholder="192.168.1.15:3000"
        value={ip}
        onChangeText={setIp}
      />

      <Pressable
        style={styles.connectButton}
        onPress={connect}
      >
        <Text style={styles.whiteText}>
          Conectar
        </Text>
      </Pressable>

      <View
        style={[
          styles.led,
          {
            backgroundColor:
              connected ? "green" : "red",
          },
        ]}
      />

      <Text style={{ marginBottom: 20 }}>
        {connected
          ? "🟢 Conectado"
          : "🔴 Desconectado"}
      </Text>

      <View style={styles.gamepad}>

        <View style={styles.dpad}>

          <Pressable
            style={styles.button}
            onPressIn={() =>
              sendInput({ jump: true })
            }
            onPressOut={() =>
              sendInput({ jump: false })
            }
          >
            <Text style={styles.buttonText}>↑</Text>
          </Pressable>

          <View style={styles.row}>
            <Pressable
              style={styles.button}
              onPressIn={() =>
                sendInput({ left: true })
              }
              onPressOut={() =>
                sendInput({ left: false })
              }
            >
              <Text style={styles.buttonText}>←</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPressIn={() =>
                sendInput({ right: true })
              }
              onPressOut={() =>
                sendInput({ right: false })
              }
            >
              <Text style={styles.buttonText}>→</Text>
            </Pressable>
          </View>

        </View>

        <Pressable
          style={styles.jumpButton}
          onPressIn={() =>
            sendInput({ jump: true })
          }
          onPressOut={() =>
            sendInput({ jump: false })
          }
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

  led: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
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