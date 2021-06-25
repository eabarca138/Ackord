<template>
  <div>
    <Navbar />

      <b-container class="d-flex justify-content-end btn-volver">
        <b-button to="/home" size="md" class="my-1 rounded" variant="dark">
          <b-icon icon="arrow-return-left" class="mx-1"></b-icon
          >Volver</b-button
        >
      </b-container>
    
    <b-container class="tabla border-dark shadow">
      <b-table
        class="text-light mt-2"
        hover
        responsive
        :items="progresiones"
        :fields="fields"
      >
        <template #cell(index)="index">
          {{ index.index + 1 }}
        </template>

        <template #cell(acciones)="row">
          <b-button
            v-b-tooltip.hover
            title="Reproducir"
            size="sm"
            @click="repTabla(row.item)"
            class="my-1 d-inline-block btn-rep"
            variant="success"
          >
            <b-icon icon="play-fill"></b-icon
          ></b-button>

          <b-button
            class="d-inline-block"
            size="sm"
            @click="borrar(row.item)"
            variant="danger"
            v-b-tooltip.hover
            title="Eliminar"
            ><b-icon icon="x-circle"></b-icon
          ></b-button>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import { mapState, mapActions } from "vuex";
import * as Tone from "tone";
export default {
  name: "Registro",
  components: {
    Navbar,
  },
  data() {
    return {
      fields: [
        "index",
        "acordes",
        "attack",
        "decay",
        "sustain",
        "release",
        "acciones",
      ],
    };
  },
  computed: {
    ...mapState(["progresiones"]),
  },
  methods: {
    ...mapActions(["borrarProgresion"]),

    borrar(progresion) {
      this.borrarProgresion(progresion);
    },

    repTabla(progresion) {
      let synth = new Tone.PolySynth().toDestination();
      let now = Tone.now();

      synth.set({
        oscillator: {
          type: "square",
        },
        volume: -13,
        envelope: {
          attack: progresion.attack,
          decay: progresion.decay,
          sustain: progresion.sustain,
          release: progresion.release,
        },
      });

      let arr = [];

      for (const el in progresion) {
        let esUnArreglo = Array.isArray(progresion[el]);
        if (esUnArreglo) {
          arr.push(progresion[el]);
        }
      }

      for (const acorde in arr) {
        synth.triggerAttackRelease(arr[acorde], "4n", (now += 1));
        console.log(arr[acorde]);
      }
      console.log(arr);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

.tabla {
  background: $color2;
}

.btn-volver{
    padding-top: 6rem;
}

@media only screen and (min-width: 568px) {
  .btn-rep {
    margin-right: .7rem;
  }
}
</style>
