import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

import Login from "./src/components/Login";
import TaskList from "./src/components/TaskList";

import firebase from "./src/services/firebaseConnection";

export default function App() {
  const [user, setUser] = useState(null); // COLOCAR EM NULL

  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const inputRef = useRef(null);

  const [key, setKey] = useState("");

  useEffect(() => {
    function getUser() {
      if (!user) {
        return;
      }
      firebase
        .database()
        .ref("tarefas")
        .child(user)
        .once("value", (snapshot) => {
          setTasks([]);

          snapshot?.forEach((childItem) => {
            let data = {
              key: childItem.key,
              nome: childItem.val().nome,
            };
            setTasks((oldTasks) => [...oldTasks, data]);
          });
        });
    }

    getUser();
  }, [user]);

  function handleDelete(key) {
    firebase
      .database()
      .ref("tarefas")
      .child(user)
      .child(key)
      .remove()
      .then(() => {
        const findTasks = tasks.filter((item) => item.key !== key);
        setTasks(findTasks);
      });
  }

  function handleEdit(data) {
    setKey(data.key);
    setNewTask(data.nome);
    inputRef.current.focus();
  }

  function handleAdd() {
    if (newTask === "") {
      Alert.alert("ATENÇÃO", "Revise os campos");
      return;
    }

    if (key !== "") {
      firebase
        .database()
        .ref("tarefas")
        .child(user)
        .child(key)
        .update({
          nome: newTask,
        })
        .then(() => {
          const taskIndex = tasks.findIndex((item) => item.key === key);
          let taskClone = tasks;
          taskClone[taskIndex].nome = newTask;

          setTasks([...taskClone]);
        });
      Keyboard.dismiss();
      setNewTask("");
      setKey("");
      return;
    }

    let tarefas = firebase.database().ref("tarefas").child(user);
    let chave = tarefas.push().key;

    tarefas
      .child(chave)
      .set({
        nome: newTask,
      })
      .then(() => {
        const data = {
          key: chave,
          nome: newTask,
        };
        setTasks((oldTasks) => [...oldTasks, data]);
      })
      .catch((err) => {
        console.log("Error: " + err);
      });
    Keyboard.dismiss();
    setNewTask("");
  }

  function cancelEdit() {
    setKey("");
    setNewTask("");
    Keyboard.dismiss();
  }

  if (!user) {
    return <Login changeStatus={(uid) => setUser(uid)} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F6FC" }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 25, fontWeight: "bold", marginBottom: 15 }}>
          TasksApp
        </Text>

        {key.length > 0 && (
          <View
            style={{
              flexDirection: "row",
              marginBottom: 8,
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={cancelEdit}>
              <Feather name="x-circle" size={22} color="#ff0000" />
            </TouchableOpacity>
            <Text style={{ marginLeft: 5, color: "#ff0000" }}>
              Você está editando uma tarefa
            </Text>
          </View>
        )}

        <View style={styles.containerTask}>
          <TextInput
            style={styles.input}
            placeholder="Oque vai fazer hoje?"
            value={newTask}
            ref={inputRef}
            onChangeText={(value) => setNewTask(value)}
          />
          {key !== "" ? (
            <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
              <Feather name="check-circle" size={24} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.btnAdd} onPress={handleAdd}>
              <Text style={styles.btnText}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <TaskList
              data={item}
              deleteItem={handleDelete}
              editItem={handleEdit}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  containerTask: {
    flexDirection: "row",
  },
  input: {
    flex: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#141414",
    height: 45,
  },
  btnAdd: {
    backgroundColor: "#141414",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  btnText: {
    color: "white",
    fontSize: 22,
  },
});
