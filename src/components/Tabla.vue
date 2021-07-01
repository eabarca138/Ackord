<template>
  <div>
    <b-container
      v-if="progresiones && progresiones.length > 0"
      class="tabla border-dark shadow"
    >
      <b-table
        class="text-light font-weight-bold mt-2"
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

<b-container
      v-else
      class="tabla border-dark shadow"
    >
      <b-table
        class="text-light mt-2"
        hover
        responsive
        :fields="fields"
      >
      </b-table>
      <span class="text-light font-weight-bold h5">No hay progresiones guardadas.</span>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import * as Tone from "tone";

export default {
  name: "Navbar",
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

  props: {
    progresiones: Array,
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
        volume: -20,
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";
.tabla {
  background: $color2;
}

@media only screen and (min-width: 568px) {
  .btn-rep {
    margin-right: 0.7rem;
  }
}
</style>
