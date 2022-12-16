import React from "react";
import {
  View,
  Text,
  StyleSheet,
  DatePickerIOSComponent,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function TaskList({ data, deleteItem, editItem }) {
  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={() => editItem(data)}>
        <Text style={{ color: "#fff", paddingRight: 10, width: "90%" }}>
          {" "}
          {data.nome}
        </Text>
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={{ marginRight: 10, width: "10%" }}
        onPress={() => deleteItem(data.key)}
      >
        <Feather name="trash" color="#FFF" size={23} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#121212",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    height: 45,
  },
});
