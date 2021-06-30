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

    notasOct3: [
      { nota: "C", notaOct: "C3", alteracion: false, notaActiva: false },
      { nota: "Db", notaOct: "Db3 C#3", alteracion: true, notaActiva: false },
      { nota: "D", notaOct: "D3", alteracion: false, notaActiva: false },
      { nota: "Eb", notaOct: "Eb3 D#3", alteracion: true, notaActiva: false },
      { nota: "E", notaOct: "E3", alteracion: false, notaActiva: false },
      { nota: "F", notaOct: "F3", alteracion: false, notaActiva: false },
      { nota: "Gb", notaOct: "Gb3 F#3", alteracion: true, notaActiva: false },
      { nota: "G", notaOct: "G3", alteracion: false, notaActiva: false },
      { nota: "Ab", notaOct: "Ab3 G#3", alteracion: true, notaActiva: false },
      { nota: "A", notaOct: "A3", alteracion: false, notaActiva: false },
      { nota: "Bb", notaOct: "Bb3 A#3", alteracion: true, notaActiva: false },
      { nota: "B", notaOct: "B3", alteracion: false, notaActiva: false },
    ],

    notasOct4: [
      { nota: "C", notaOct: "C4", alteracion: false, notaActiva: false },
      { nota: "Db", notaOct: "Db4 C#4", alteracion: true, notaActiva: false },
      { nota: "D", notaOct: "D4", alteracion: false, notaActiva: false },
      { nota: "Eb", notaOct: "Eb4 D#4", alteracion: true, notaActiva: false },
      { nota: "E", notaOct: "E4", alteracion: false, notaActiva: false },
      { nota: "F", notaOct: "F4", alteracion: false, notaActiva: false },
      { nota: "Gb", notaOct: "Gb4 F#4", alteracion: true, notaActiva: false },
      { nota: "G", notaOct: "G4", alteracion: false, notaActiva: false },
      { nota: "Ab", notaOct: "Ab4 G#4", alteracion: true, notaActiva: false },
      { nota: "A", notaOct: "A4", alteracion: false, notaActiva: false },
      { nota: "Bb", notaOct: "Bb4 A#4", alteracion: true, notaActiva: false },
      { nota: "B", notaOct: "B4", alteracion: false, notaActiva: false },
    ],

    nombreAcorde: "",
    notasAcorde: [],
    progresion: [],

    env: {
    attack: 1,
    decay: 1,
    release: 1.5,
    sustain: 0.5
  },

    //URL VARS

    fundamental: "C",
    triada: "",
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
    actualizarTipo(state, triada) {
      state.triada = triada;
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

    asignarFundamental(state, payload) {
      state.fundamental = payload;
    },

    asignarEnv(state, env) {
      state.env = env
    },

    AgregarNotasAcorde(state, payload) {
      if (!payload) return;
      state.notasAcorde = payload;
    },

    AgregarNombreAcorde(state, payload) {
      if (!payload) return;
      state.nombreAcorde = payload;
    },

    agregarAcorde(state) {
      let acorde = {
        notas: state.notasAcorde,
        nombre: state.nombreAcorde,
        env: state.env,
      };

      state.progresion.push(acorde);
    },

    activarNotas(state) {
      state.notasOct3.forEach((el) => {
        const interseccion = state.notasAcorde.filter((element) =>
          el.notaOct.includes(element)
        );
        el.notaActiva = !interseccion.length ? false : true;
        el.notaRend = !interseccion.length ? "" : interseccion[0].slice(0, -1);
      });

      state.notasOct4.forEach((el) => {
        const interseccion = state.notasAcorde.filter((element) =>
          el.notaOct.includes(element)
        );
        el.notaActiva = !interseccion.length ? false : true;
        el.notaRend = !interseccion.length ? "" : interseccion[0].slice(0, -1);
      });
    },

    borrarAcorde(state, i) {
      state.progresion.splice(i, 1);
    },

    limpiarProgresion(state) {
      state.progresion = [];
    },

    guardarP(state, payload) {
      state.progresion = [];
      state.progresiones.push(payload);
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
    login({ state, commit }) {
      firebase
        .auth()
        .signInWithEmailAndPassword(state.auth.email, state.auth.password)
        .then((userCredential) => {
          console.log(userCredential);
          router.push("home");
          commit("logoutGoogleauth")
        })
        .catch((error) => {
          alert(error.message);
        });
    },

    googleLogin({commit}) {
      let provider = new firebase.auth.GoogleAuthProvider();

      try {
        firebase
          .auth()
          .signInWithPopup(provider)
          .then((result) => {
            commit("loginGoogleauth")
            console.log(result);
            router.push("home");
          });
      } catch (error) {
        console.log(error);
      }
    },

    //Petición API
    async getData({ state, commit }, oct = 3) {
      const url = `https://api.uberchord.com/v1/chords/${state.fundamental}_${state.triada}${state.septima}${state.novena}`;

      try {
        const req = await axios(url);
        const notas = req.data[0].tones;
        const nombreAcorde = req.data[0].chordName;

        //Agrego octava fundamental
        const arr = notas.split(",");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i] + oct;
        }

        // 3era en octava contigua
        if (
          arr[0] == "Ab3" ||
          arr[0] == "A3" ||
          arr[0] == "Bb3" ||
          arr[0] == "B3"
        ) {
          arr[1] = arr[1].replace(/3/, "4");
        }
        if (
          arr[0] == "Ab4" ||
          arr[0] == "A4" ||
          arr[0] == "Bb4" ||
          arr[0] == "B4"
        ) {
          arr[1] = arr[1].replace(/4/, "5");
        }

        // 5ta en octava contigua
        if (
          arr[0] == "F3" ||
          arr[0] == "F#3" ||
          arr[0] == "Gb3" ||
          arr[0] == "G3" ||
          arr[0] == "G#3" ||
          arr[0] == "Ab3" ||
          arr[0] == "A3" ||
          arr[0] == "Bb3" ||
          arr[0] == "B3"
        ) {
          arr[2] = arr[2].replace(/3/, "4");
        }
        if (
          arr[0] == "F4" ||
          arr[0] == "F#4" ||
          arr[0] == "Gb4" ||
          arr[0] == "G4" ||
          arr[0] == "G#4" ||
          arr[0] == "Ab4" ||
          arr[0] == "A4" ||
          arr[0] == "Bb4" ||
          arr[0] == "B4"
        ) {
          arr[2] = arr[2].replace(/4/, "5");
        }

        //7ma en octava contigua
        if (
          arr[3] &&
          (arr[0] == "D3" ||
            arr[0] == "Eb3" ||
            arr[0] == "E3" ||
            arr[0] == "F3" ||
            arr[0] == "F#3" ||
            arr[0] == "G3" ||
            arr[0] == "G#3" ||
            arr[0] == "Ab3" ||
            arr[0] == "A3" ||
            arr[0] == "Bb3" ||
            arr[0] == "B3")
        ) {
          arr[3] = arr[3].replace(/3/, "4");
        }

        if (
          arr[3] &&
          (arr[0] == "D4" ||
            arr[0] == "Eb4" ||
            arr[0] == "E4" ||
            arr[0] == "F4" ||
            arr[0] == "F#4" ||
            arr[0] == "G4" ||
            arr[0] == "G#4" ||
            arr[0] == "Ab4" ||
            arr[0] == "A4" ||
            arr[0] == "Bb4" ||
            arr[0] == "B4")
        ) {
          arr[3] = arr[3].replace(/4/, "5");
        }

        //9na en octava contigua}


        commit("AgregarNotasAcorde", arr);
        commit("AgregarNombreAcorde", nombreAcorde);
        commit("activarNotas");
      } catch (error) {
        console.log(error);
      }
    },

    async tocarAcorde({ state, commit, dispatch }, payload) {
      let fundamental = payload.nota;
      commit("asignarFundamental", fundamental);

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
      let env = synth.get().envelope;
      commit("asignarEnv", env)
    },

    //Carga DB

    async getProgresiones({ commit, state }) {
      const db = firebase.firestore();
      let req;
      try {
        if (state.auth.googleAuth == true) {
          state.progresiones = [];

        } else if (state.auth.email == "usuario1@ackord.com") {
          req = await db.collection("usuario1").get();
          state.progresiones = [];
          req.docs.forEach((progresion) => {
            const obj = progresion.data();
            const id = progresion.id;
            obj.id = id;
            commit("getP", obj);
          });

        } else if (state.auth.email == "gonzafg2@gmail.com") {
          req = await db.collection("usuario2").get();
          state.progresiones = [];
          req.docs.forEach((progresion) => {
            const obj = progresion.data();
            const id = progresion.id;
            obj.id = id;
            commit("getP", obj);
          });
        }
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
        if (state.auth.googleAuth == true) {
          commit("guardarP", obj);

        } else if (state.auth.email == "usuario1@ackord.com") {
          await db.collection("usuario1").add(obj);
          //Agregar a Vuex
          commit("guardarP", obj);

        } else if (state.auth.email == "gonzafg2@gmail.com") {
          await db.collection("usuario2").add(obj);
          //Agregar a Vuex
          commit("guardarP", obj);
        }
      } catch (error) {
        console.log(error);
      }
    },

    async borrarProgresion({ commit, state }, payload) {
      const progresion = payload;
      if (!progresion) return;
      const idFirebase = progresion.id;

      // Eliminar desde Firebase
      try {
        const db = firebase.firestore();
        if (state.auth.googleAuth == true) {
          // Eliminar desde Vuex
          commit("borrarProgresion", progresion);
        } else if (state.auth.email == "usuario1@ackord.com") {
          await db.collection("usuario1").doc(idFirebase).delete();
          // Eliminar desde Vuex
          commit("borrarProgresion", progresion);
        } else if (state.auth.email == "gonzafg2@gmail.com") {
          await db.collection("usuario2").doc(idFirebase).delete();
          // Eliminar desde Vuex
          commit("borrarProgresion", progresion);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  modules: {
    auth,
  },
});
