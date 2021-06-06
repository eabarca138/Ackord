import Vue from "vue";
import Vuex from "vuex";
import router from '@/router'
import firebase from "firebase"


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    email: "",
    password: "",
    notas: [
      { nota: "C", alteracion: false },
      { nota: "C#", alteracion: true },
      { nota: "D", alteracion: false },
      { nota: "D#", alteracion: true },
      { nota: "E", alteracion: false },
      { nota: "F", alteracion: false },
      { nota: "F#", alteracion: true },
      { nota: "G", alteracion: false },
      { nota: "G#", alteracion: true },
      { nota: "A", alteracion: false },
      { nota: "A#", alteracion: true },
      { nota: "B", alteracion: false },
    ],
  },
  mutations: {
    updateEmail(state, email) {
      state.email = email;
    },
    updatePassword(state, password) {
      state.password = password;
    },
  },
  actions: {
    login({ state }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(state.email, state.password)
        .then((userCredential) => {
          console.log(userCredential);
          router.push("home");
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
  modules: {},
});
