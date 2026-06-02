import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function HomeScreen() {
  const [ip, setIp] = useState("");
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const conectar = () => {
    const newSocket = new WebSocket(`ws://${ip}:3000/ws`);

    newSocket.onopen = () => {
      setConnected(true);
    };

    setSocket(newSocket);
  };

  const enviarMensaje = (mensaje: string) => {
    socket?.send(mensaje);
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
            onPress={() => enviarMensaje("Entrar")}
          >
            <Text style={styles.buttonText}>↑</Text>
          </Pressable>

          <View style={styles.row}>
            <Pressable
              style={styles.button}
              onPress={() => enviarMensaje("izquierda")}
            >
              <Text style={styles.buttonText}>←</Text>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => enviarMensaje("derecha")}
            >
              <Text style={styles.buttonText}>→</Text>
            </Pressable>
          </View>
        </View>

        <Pressable
          style={styles.jumpButton}
          onPress={() => enviarMensaje("saltar")}
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
