import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
//import { Button } from "./src/Button";
import RNBluetoothClassic from "react-native-bluetooth-classic";
import { useEffect, useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";

export default function App() {
  const [device, setDevice] = useState();

  // Tries to find and connect to arduino by device name
  // If the arduino is not found, does nothing
  const findArduino = async () => {
    if (device) return;
    try {
      const paired = await RNBluetoothClassic.getBondedDevices();
      for (const device of paired) {
        if (device.name == "RUDYHOBT") {
          setDevice(device);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Try to find and connect to arduino every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      findArduino();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const readDeviceData = useCallback(async () => {
    if (!device) {
      console.log("Device not available yet");
      return;
    }
    try {
      const message = await device.read();
      console.log(message)
      if (message) {
        console.log(message.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [device]);

  // Read data from device every 1 second if available
  useEffect(() => {
    const interval = setInterval(() => {
      readDeviceData();
    }, 1000);
    return () => clearInterval(interval);
  }, [device]);

  // Connect to device when it becomes available
  useEffect(() => {
    (async () => {
      try {
        let isConnected = await device.isConnected();
        if (!isConnected) {
          await device.connect();
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [device]);

  
  const [text, onChangeText] = useState("");
  const handleInput = async () => {
    console.log(text)
  }
  return (
    <View style={styles.container}>
      <Text>Oximeter interval</Text>
      <Text>Temperature interval</Text>
      <TextInput  style={styles.containerInput}
                  placeholder="Type here"
                  onChangeText={onChangeText}
                  value={text}
      />
      <Button
        title="Send"
        onPress={handleInput}
        style={styles.buttonContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  containerInput: {
    borderColor: "black",
    borderWidth: 2,
    fontSize: 17,
    paddingBottom: 8,
    width: 150,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 32,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
