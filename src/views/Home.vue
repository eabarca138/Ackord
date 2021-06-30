<template>
  <div>
    <Navbar />

<!-- VISOR ACORDES -->
    <section class="cont-visor">
      <b-container class="visor-acordes border border-light">
        <div class="d-flex justify-content-between px-5 contenedor-iconos">
          <div v-b-tooltip.hover title="Reproducir">
            <b-icon
              @click="reproducir"
              icon="play-circle"
              class="h3 icono-acordes"
              variant="light"
            ></b-icon>
          </div>

          <div class="d-flex flex-row-reverse">
            <svg
              v-b-tooltip.hover
              title="Guardar"
              @click="guardarProg"
              class="guardar icono-acordes"
              viewBox="0 0 448 512"
            >
              <path
                fill="#fff"
                d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM272 80v80H144V80h128zm122 352H54a6 6 0 0 1-6-6V86a6 6 0 0 1 6-6h42v104c0 13.255 10.745 24 24 24h176c13.255 0 24-10.745 24-24V83.882l78.243 78.243a6 6 0 0 1 1.757 4.243V426a6 6 0 0 1-6 6zM224 232c-48.523 0-88 39.477-88 88s39.477 88 88 88 88-39.477 88-88-39.477-88-88-88zm0 128c-22.056 0-40-17.944-40-40s17.944-40 40-40 40 17.944 40 40-17.944 40-40 40z"
              ></path>
            </svg>

            <div v-b-tooltip.hover title="Borrar progresión">
              <b-icon
                icon="trash"
                class="h3 icono-acordes"
                variant="light"
                @click="limpiarProgresion"
              ></b-icon>
            </div>
          </div>
        </div>

        <ul class="m-0" v-if="progresion && progresion.length > 0">
          <li
            class="item-acorde rounded-circle"
            v-for="(acorde, i) in progresion"
            :key="i"
          >
            {{ acorde.nombre | filtrarComas }}
            <span
              class="rounded-circle boton-eliminar"
              @click="borrar(i)"
              v-b-tooltip.hover
              title="Borrar acorde"
              >x</span
            >
          </li>
        </ul>
      </b-container>
    </section>

    <section>
      <b-container>
        <b-row>
          <!-- OCTAVA 3 -->
          <b-col lg="6" md="12" class="px-0">
            <div class="d-flex pt-5 px-0" v-if="notasOct3 && notasOct3.length > 0">
              <div
                v-for="(nota, i) in notasOct3"
                class="border border-dark"
                v-bind:class="[
                  { active: nota.notaActiva },
                  nota.alteracion ? alteracion : natural,
                ]"
                :key="i"
                @click="tocar({ oct: 3, nota: nota.nota })"
              >
                <span class="mt-4 d-block">{{ nota.notaRend }}</span>
              </div>
            </div>
          </b-col>

          <!-- OCTAVA 4 -->
          <b-col lg="6" md="12" class="px-0">
            <div class="d-flex pt-5 px-0" v-if="notasOct4 && notasOct4.length > 0">
              <div
                v-for="nota in notasOct4"
                v-bind:class="[
                  { active: nota.notaActiva },
                  nota.alteracion ? alteracion : natural,
                ]"
                class="border border-dark"
                :key="nota.nota"
                @click="tocar({ oct: 4, nota: nota.nota })"
              >
                <span class="mt-4 d-block">{{ nota.notaRend }}</span>
              </div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

  <!-- CONTROLES ENV -->
    <section>
      <b-container class="mt-3">
        <b-row class="d-flex justify-content-around">
          <b-col lg="3" md="6" sm="12">
            <label
              >A<input
                v-model="attack"
                type="range"
                min="0"
                max="2"
                step="0.05"
                value="1.0"
            /></label>
          </b-col>

          <b-col lg="3" md="6" sm="12">
            <label
              >D<input
                v-model="decay"
                type="range"
                min="0"
                max="2"
                step="0.05"
                value="1.0"
            /></label>
          </b-col>

          <b-col lg="3" md="6" sm="12">
            <label
              >S<input
                v-model="sustain"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value="0.5"
            /></label>
          </b-col>

          <b-col lg="3" md="6" sm="12">
            <label
              >R<input
                v-model="release"
                type="range"
                min="0"
                max="3"
                step="0.05"
                value="1.5"
            /></label>
          </b-col>
        </b-row>
      </b-container>
    </section>

    <section>
      <b-container>
        <b-row class="mt-3">
          <b-col lg="3" md="6">
            <output class="border border-secondary out">{{
              nombreAcorde | filtrarComas
            }}</output>
          </b-col>

        <!-- TIPO DE ACORDE -->
          <b-col lg="3" md="6">
            <select class="mx-3" v-model="triada">
              <option disabled >Triadas</option>
              <option value="">Mayor</option>
              <option value="m">Menor</option>
              <option value="aug">Aumentado</option>
              <option value="dim">Disminuido</option>
            </select>
          </b-col>

          <b-col lg="3" md="6">
            <div>
              <p class="d-inline-block text-light">7ª</p>
              <label class="mx-3 switch">
                <input
                  type="checkbox"
                  v-model="septima"
                  true-value="7"
                  false-value=""
                />
                <span class="slider round"></span>
              </label>
            </div>
          </b-col>

          <b-col lg="3" md="6">
            <div>
              <p class="d-inline-block text-light">9ª</p>
              <label class="mx-3 switch"
                ><input
                  type="checkbox"
                  v-model="novena"
                  true-value="9"
                  false-value="" />
                <span class="slider round"></span
              ></label>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>

  <!-- AGREGAR ACORDE -->
    <section class="agregar">
      <b-container class="d-flex justify-content-center">
        <button class="btn btn-success mx-2 py-auto" @click="agregarAcorde">
          Agregar acorde
        </button>
      </b-container>
    </section>
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
    ...mapState([
      "notasOct3",
      "notasOct4",
      "acorde",
      "progresion",
      "nombreAcorde",
    ]),

    fundamental: {
      get() {
        return this.$store.state.fundamental;
      },

      set(value) {
        this.$store.commit("actualizarFundamental", value);
      },
    },
    triada: {
      get() {
        return this.$store.state.triada;
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
    ...mapMutations([
      "agregarAcorde",
      "borrarAcorde",
      "limpiarProgresion",
      "reproducirProgresion",
    ]),
    ...mapActions(["getData", "getProgresiones", "tocarAcorde", "guardarProgresion"]),

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
      this.reproducirProgresion();
    },
  },
  created() {
    this.getData();
    this.getProgresiones()
  },

  filters: {
    filtrarComas: function (value) {
      return value.replace(/,/g, "");
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/_variables.scss";

//VISOR
      .visor-acordes {
        background: $color1;
        border: #fff;
        box-shadow: 2px 2px 4px #000000;
        position: relative;
        padding: 3rem;
        min-height: 10rem;
      }
      
      .cont-visor {
        padding-top: 7rem;
      }
      
      .item-acorde {
        color: #fff;
        font-weight: bold;
        width: 4.6rem;
        padding: 1.5625rem;
        border-radius: 50%;
        border: white;
        background-image: linear-gradient($color2, $color1);
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
        &:hover {
          cursor: pointer;
          background: rgb(87, 12, 12);
        }
      }
      
      .contenedor-iconos {
        position: absolute;
        left: .5rem;
        top: 0.7rem;
        width: 100%;
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

//TECLAS

.natural {
  background-color: #fff;
  height: 6rem;
  width: 50%;
  cursor: pointer;
  &:hover {
    background-color: rgba(255, 255, 0, 0.6);
    color: #fff;
  }
}

.alteracion {
  width: 25%;
  //background-image: radial-gradient(#5d5d5d, black);
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

.active {
  font-weight: bold;
  background-color: rgba(255, 255, 0, 0.6);
}

//OPCIONES

.out {
  color: #fff;
  background-color: $color1;
  height: 1.3rem;
  width: 9rem;
}

label {
  color: #fff;
}
select {
  color: #fff;
  background-color: $color1;
  width: 9rem;
}
option {
  padding: 1.25rem;
  color: #fff;
  padding: 0.5rem 1rem;
  border: 1px solid transparent;
}

.switch {
  position: relative;
  display: inline-block;
  width: 2.8125rem;
  height: 1.25rem;
  margin-top: .6rem;
}

@media only screen and (min-width: 992px) {
  .switch {
    margin-top: 0;
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 11px;
  width: 12px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196f3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 2.125rem;
}

.slider.round:before {
  border-radius: 50%;
}

.agregar{
  margin-bottom: 3rem;
  padding-bottom: 3rem;
}

@media only screen and (min-width: 992px) {
  .agregar{
    margin-top: 2.3rem;
  }
}

</style>
