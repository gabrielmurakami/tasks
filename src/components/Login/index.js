import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";

import firebase from "../../services/firebaseConnection";

export default function Login({ changeStatus }) {
  const [type, setType] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    if (type === "login") {
      const user = firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.uid);
        })
        .catch((err) => {
          alert("Erro no login");
          return;
        });
    } else {
      const user = firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((user) => {
          changeStatus(user.user.iud);
        })
        .catch((err) => {
          alert("Erro no cadastro");
          return;
        });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6fc" }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          autoCapitalize={false}
          keyboardType="email-address"
          placeholder="Seu email"
          value={email}
          onChangeText={(value) => setEmail(value)}
        />
        <TextInput
          style={styles.input}
          placeholder="********"
          autoCorrect={false}
          autoCapitalize={false}
          value={password}
          onChangeText={(value) => setPassword(value)}
        />
        <TouchableOpacity
          style={[
            styles.handleLogin,
            { backgroundColor: type === "login" ? "#3ea6f2" : "#141414" },
          ]}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>
            {type === "login" ? "Acessar" : "Cadastrar"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            setType((type) => (type === "login" ? "cadastrar" : "login"))
          }
        >
          <Text style={{ textAlign: "center" }}>
            {type === "login" ? "Criar uma conta" : "Já possuo uma conta"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 10,
  },

  input: {
    marginBottom: 10,
    backgroundColor: "white",
    borderRadius: 4,
    height: 45,
    padding: 10,
    borderWidth: 1,
    borderColor: "#141414",
  },
  handleLogin: {
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    marginBottom: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 17,
  },
});
