import Vue from "vue";
import Vuex from "vuex";
import router from '@/router'
import firebase from "firebase"
import axios from "axios";
import * as Tone from "tone";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //Auth

    email: "",
    password: "",

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

  mutations: {
    actualizarEmail(state, email) {
      state.email = email;
    },
    actualizarPassword(state, password) {
      state.password = password;
    },

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
      let acorde = { notas: state.notasAcorde, nombre: state.nombreAcorde };

      state.progresion.push(acorde);
      console.log(state.progresion);
    },
    borrarAcorde(state, i) {
      state.progresion.splice(i, 1);
    },
    limpiarProgresion(state) {
      state.progresion = [];
    },

    guardarP(state) {
      const progresion = state.progresion;
      if (!progresion) return;

      let nombres = state.progresion.map((x) => {
        return x.nombre;
      });
      const obj = Object.assign({}, nombres);
      state.progresiones.push(obj);
      console.log(obj);
      console.log(state.progresiones);
      state.progresion = [];

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
      console.log(synth.get());
    },

    async guardarProgresion({ commit /* state */ }) {
      //const progresion = state.progresion;

      // Agregar Firebase
      /*       try {
        let db = firebase.firestore();
        await db.collection("progresiones").add(progresion);
      } catch (error) {
        console.log(error);
      } */

      //Agregar a Vuex
      commit("guardarP");
    },
  },
  modules: {},
});
