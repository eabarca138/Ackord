<template>
  <div>
    <Navbar />

    <b-container class="tabla">
      <b-table striped hover :items="progresiones" :fields="fields">

             <template #cell(index)="data">
        {{ data.index + 1 }}
      </template>

        <template #cell(actions)="row">
          <b-button
            size="sm"
            @click="repTabla(row.item)"
            class="my-1 me-4"
            variant="primary"
          >
            <b-icon icon="play-fill"></b-icon
          ></b-button>

          <b-button size="sm" @click="borrar(row.item)" variant="danger"
            >X</b-button
          >
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
        "actions",
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
.tabla {
  margin-top: 7rem;
}
</style>
