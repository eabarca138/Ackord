<template>
  <div>
    <Navbar />

    <b-container
      @click="reproducir"
      class="contenedor-acordes border border-light"
    >
      <div class="d-flex justify-content-between px-5 contenedor-iconos">
        <b-icon
          icon="play-circle"
          class="h3 icono-acordes"
          variant="light"
        ></b-icon>

        <div class="d-flex flex-row-reverse">
          <svg
            @click="guardarProg"
            class="guardar icono-acordes"
            viewBox="0 0 448 512"
          >
            <path
              fill="#fff"
              d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"
            ></path>
          </svg>
          <b-icon
            icon="trash"
            class="h3 icono-acordes"
            variant="light"
            @click="limpiarProgresion"
          ></b-icon>
        </div>
      </div>

      <ul class="m-0">
        <li
          class="item-acorde rounded-circle"
          v-for="(acorde, i) in progresion"
          :key="i"
        >
          {{ acorde.nombre }}
          <span class="rounded-circle boton-eliminar" @click="borrar(i)"
            >x</span
          >
        </li>
      </ul>
    </b-container>

    <b-container>
      <b-row>
        <b-col lg="6" md="12" class="px-0">
          <div class="d-flex pt-5 px-0">
            <div
              v-bind:class="[nota.alteracion ? alteracion : natural]"
              class="border border-dark"
              v-for="(nota, i) in notas"
              :key="i"
              @click="tocar({ oct: 3, nota: nota.nota })"
            >
              {{ nota.nota }}
            </div>
          </div>
        </b-col>

        <b-col lg="6" md="12" class="px-0">
          <div class="d-flex pt-5 px-0">
            <div
              v-bind:class="[nota.alteracion ? alteracion : natural]"
              class="border border-dark"
              v-for="nota in notas"
              :key="nota.nota"
              @click="tocar({ oct: 4, nota: nota.nota })"
            >
              {{ nota.nota }}
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <b-container class="mt-3">
      <label
        >Fundamental:<select v-model="fundamental">
          <option>C</option>
          <option>C#</option>
          <option>D</option>
          <option>D#</option>
          <option>E</option>
          <option>F</option>
          <option>F#</option>
          <option>G</option>
          <option>G#</option>
          <option>A</option>
          <option>A#</option>
          <option>B</option>
        </select></label
      >

      <label
        >Tipo:<select v-model="tipo">
          <option value="">mayor</option>
          <option value="m">menor</option>
          <option value="aug">aumentado</option>
          <option value="dim">disminuido</option>
          <option>sus2</option>
          <option>sus4</option>
        </select></label
      >

      <label>Séptima:</label
      ><select v-model="septima">
        <option value="7">7</option>
        <option value=""></option>
      </select>

      <label
        >Novena:<select v-model="novena">
          <option value="9">9</option>
          <option value=""></option></select
      ></label>

      <button class="btn btn-success mx-2" @click="agregarAcorde">
        Agregar acorde
      </button>
    </b-container>

    <b-container>
      <div class="mt-3 env">
        <div>
          <label
            >A<input
              v-model="attack"
              type="range"
              min="0"
              max="2"
              step="0.05"
              value="1.0"
          /></label>
        </div>
        <div>
          <label
            >D<input
              v-model="decay"
              type="range"
              min="0"
              max="2"
              step="0.05"
              value="1.0"
          /></label>
        </div>
        <div>
          <label
            >S<input
              v-model="sustain"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value="0.5"
          /></label>
        </div>
        <div>
          <label
            >R<input
              v-model="release"
              type="range"
              min="0"
              max="3"
              step="0.05"
              value="1.5"
          /></label>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "Home",
  components: {
    Navbar,
  },
  data() {
    return {
      natural: "natural",
      alteracion: "alteracion",
    };
  },
  computed: {
    ...mapState(["notas", "acorde", "progresion"]),

    fundamental: {
      get() {
        return this.$store.state.fundamental;
      },

      set(value) {
        this.$store.commit("actualizarFundamental", value);
      },
    },
    tipo: {
      get() {
        return this.$store.state.tipo;
      },

      set(value) {
        this.$store.commit("actualizarTipo", value);
      },
    },
    septima: {
      get() {
        return this.$store.state.septima;
      },

      set(value) {
        this.$store.commit("actualizarSeptima", value);
      },
    },
    novena: {
      get() {
        return this.$store.state.novena;
      },

      set(value) {
        this.$store.commit("actualizarNovena", value);
      },
    },

    attack: {
      get() {
        return this.$store.state.attack;
      },

      set(value) {
        this.$store.commit("actualizarAttack", value);
      },
    },
    decay: {
      get() {
        return this.$store.state.decay;
      },

      set(value) {
        this.$store.commit("actualizarDecay", value);
      },
    },
    sustain: {
      get() {
        return this.$store.state.sustain;
      },

      set(value) {
        this.$store.commit("actualizarSustain", value);
      },
    },
    release: {
      get() {
        return this.$store.state.release;
      },

      set(value) {
        this.$store.commit("actualizarRelease", value);
      },
    },
  },
  methods: {
    ...mapMutations(["agregarAcorde", "borrarAcorde", "limpiarProgresion", "reproducirProgresion"]),
    ...mapActions(["getData", "tocarAcorde", "guardarProgresion"]),

    tocar(oct, el) {
      this.tocarAcorde(oct, el);
    },
    borrar(i) {
      this.borrarAcorde(i);
    },
    guardarProg() {
      const progresion = this.progresion;
      if (progresion.length == 0) return alert("Agrega algún acorde");

      this.guardarProgresion();
      alert("Progresión guardada");
    },
    reproducir() {
      this.reproducirProgresion()
    },
  },
  created() {
    this.getData();
  },
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";
.natural {
  background-color: #fff;
  height: 6rem;
  width: 50%;
}
.natural:hover {
  background-color: black;
  color: #fff;
}
.alteracion {
  width: 25%;
  background-image: radial-gradient(#5d5d5d, black);
  color: #fff;
}

label {
  color: #fff;
}
select {
  color: #fff;
  background-color: $color1;
}
option {
  padding: 20px;
  color: #fff;
  padding: 8px 16px;
  border: 1px solid transparent;
}

.contenedor-acordes {
  position: relative;
  border: #fff;
  padding: 3rem;
  min-height: 10rem;
  margin-top: 7rem;
  box-shadow: 2px 2px 4px #000000;
}

.item-acorde {
  width: 4.6rem;
  padding: 1.5625rem;
  border-radius: 50%;
  border: white;
  background-color: #fff;
  display: inline-block;
  margin: 1rem;
  position: relative;
  box-shadow: 2px 2px 4px #000000;
  &:hover {
    background-color: rgb(252, 236, 236);
  }
}

.boton-eliminar {
  position: absolute;
  top: 0;
  right: 0;
  width: 30%;
  background-color: rgb(255, 0, 0);
  color: #fff;
}

.boton-eliminar:hover {
  cursor: pointer;
  background-color: rgb(134, 9, 9);
}

.contenedor-iconos {
  position: absolute;
  top: 0.7rem;
  width: 97%;
}
.icono-acordes {
  cursor: pointer;
  &:hover {
    fill: rgb(138, 133, 133);
  }
}
.guardar {
  margin-left: 1.25rem;
  height: 51%;
  width: 14%;
}
</style>
