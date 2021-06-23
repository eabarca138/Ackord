import Vue from "vue";
import Vuex from "vuex";
import auth from "./modules/auth"
import createPersistedState from 'vuex-persistedstate';
import router from '@/router'
import firebase from "firebase"
import axios from "axios";
import * as Tone from "tone";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //Data gral

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

    nombreAcorde: "",
    notasAcorde: [],
    progresion: [],
    env: [],

    //URL VARS

    fundamental: "C",
    tipo: "",
    septima: "",
    novena: "",

    //ENV

    attack: 1.0,
    decay: 1.0,
    sustain: 0.5,
    release: 1.5,

    //CRUD

    progresiones: [],
  },

  //Persistencia datos auth

  plugins: [
    createPersistedState({
      paths: ["auth"],
    }),
  ],

  mutations: {
    actualizarFundamental(state, fundamental) {
      state.fundamental = fundamental;
    },
    actualizarTipo(state, tipo) {
      state.tipo = tipo;
    },
    actualizarSeptima(state, septima) {
      state.septima = septima;
    },
    actualizarNovena(state, novena) {
      state.novena = novena;
    },

    actualizarAttack(state, attack) {
      state.attack = attack;
    },
    actualizarDecay(state, decay) {
      state.decay = decay;
    },
    actualizarSustain(state, sustain) {
      state.sustain = sustain;
    },
    actualizarRelease(state, release) {
      state.release = release;
    },

    agregarAcorde(state) {
      let acorde = {
        notas: state.notasAcorde,
        nombre: state.nombreAcorde,
        env: state.env,
      };

      state.progresion.push(acorde);
      console.log(state.progresion);
    },
    borrarAcorde(state, i) {
      state.progresion.splice(i, 1);
    },
    limpiarProgresion(state) {
      state.progresion = [];
    },

    guardarP(state, payload) {
      state.progresiones.push(payload);

      console.log(state.progresiones);
      state.progresion = [];
    },

    getP(state, payload) {
      const progresion = payload;
      if (!progresion) return;
      state.progresiones.push(progresion);
    },

    reproducirProgresion(state) {
      let synth = new Tone.PolySynth().toDestination();
      let now = Tone.now();

      synth.set({
        oscillator: {
          type: "square",
        },
        volume: -13,
        envelope: {
          attack: state.attack,
          decay: state.decay,
          sustain: state.sustain,
          release: state.release,
        },
      });

      state.progresion.forEach((x) => {
        synth.triggerAttackRelease(x.notas, "4n", (now += 1));
      });
    },

    borrarProgresion(state, payload) {
      const progresion = payload;
      if (!progresion) return;
      const index = state.progresiones.indexOf(progresion);
      const index2 = state.progresiones.indexOf(index);
      console.log(index2);
      state.progresiones.splice(index, 1);
    },
  },
  actions: {
    login({ state }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(state.auth.email, state.auth.password)
        .then((userCredential) => {
          console.log(userCredential);
          router.push("home");
        })
        .catch((error) => {
          alert(error.message);
        });
    },

    //Petición API
    async getData({ state }, oct = 3) {
      const url = `https://api.uberchord.com/v1/chords/${state.fundamental}_${state.tipo}${state.septima}${state.novena}`;

      try {
        const req = await axios(url);
        console.log(req);
        const notas = req.data[0].tones;
        const nombre = req.data[0].chordName;

        //Agrego octava
        const arr = notas.split(",");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i] + oct;
        }
        console.log(arr);
        console.log(nombre);
        state.notasAcorde = arr;
        state.nombreAcorde = nombre;
      } catch (error) {
        console.log(error);
      }
    },

    async tocarAcorde({ state, dispatch }, payload) {
      state.fundamental = payload.nota;
      console.log(state.fundamental);
      await dispatch("getData", payload.oct);

      let synth = new Tone.PolySynth().toDestination();

      synth.set({
        oscillator: {
          type: "square",
          volume: -13,
        },
        envelope: {
          attack: state.attack,
          decay: state.decay,
          sustain: state.sustain,
          release: state.release,
        },
      });

      synth.triggerAttackRelease(state.notasAcorde, "4n");
      state.env = synth.get().envelope;
      console.log(state.env);
    },

    //Carga DB

    async getProgresiones({ commit, state }) {
      const db = firebase.firestore();
      let req;
      try {
        if (state.auth.email == "eabarca171@gmail.com") {
          req = await db.collection("progresiones").get();
        } else if (state.auth.email == "gonzafg2@gmail.com") {
          req = await db.collection("progresiones2").get();
        }

        state.progresiones = [];
        req.docs.forEach((progresion) => {
          const obj = progresion.data();
          const id = progresion.id;
          obj.id = id;
          commit("getP", obj);
        });
      } catch (error) {
        console.log(error);
      }
    },

    async guardarProgresion({ commit, state }) {
      const progresion = state.progresion;
      if (!progresion) return;

      let arrAcordes = state.progresion.map((x) => {
        return x.nombre.replace(/,/g, "");
      });

      const obj = {};
      state.progresion.forEach((progresion, i) => {
        obj[i] = progresion.notas;
      });
      obj.acordes = arrAcordes.toString();

      state.progresion.forEach((x) => {
        obj.attack = x.env.attack;
        obj.decay = x.env.decay;
        obj.sustain = x.env.sustain;
        obj.release = x.env.release;
      });

      // Guardar en Firebase
      try {
        let db = firebase.firestore();
        if (state.auth.email == "eabarca171@gmail.com") {
          await db.collection("progresiones").add(obj);
        } else if (state.auth.email == "gonzafg2@gmail.com") {
          await db.collection("progresiones2").add(obj);
        }
      } catch (error) {
        console.log(error);
      }

      //Agregar a Vuex
      commit("guardarP", obj);
    },

    async borrarProgresion({ commit, state }, payload) {
      const progresion = payload;
      if (!progresion) return;
      const idFirebase = progresion.id;

      // Eliminar desde Firebase
      try {
        const db = firebase.firestore();
        if (state.auth.email == "eabarca171@gmail.com") {
          await db.collection("progresiones").doc(idFirebase).delete();
        } else if (state.auth.email == "gonzafg2@gmail.com") {
          await db.collection("progresiones2").doc(idFirebase).delete();
        }
      } catch (error) {
        console.log(error);
      }

      // Eliminar desde Vuex
      commit("borrarProgresion", progresion);
    },
  },
  modules: {
    auth,
  },
});
