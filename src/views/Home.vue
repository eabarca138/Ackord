<template>
  <div>
    <Navbar />

    <b-container class="secuencia border border-light"> </b-container>

    <b-container>
      <b-row>
        <b-col lg="6" md="12" class="px-0">
          <div class="d-flex pt-5 px-0">
            <div
              v-bind:class="[nota.alteracion ? alteracion : natural]"
              class="border border-dark"
              v-for="(nota, i) in notas"
              :key="i"
              @click="tocarNota(nota.nota + 3)"
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
              @click="tocarNota(nota.nota + 4)"
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
          <option value=""></option>
        </select></label
      >
    </b-container>


<b-container>
      <div class="mt-3 env">
        <div>
          <label
            >A<input type="range" min="0" max="2" step="0.05" value="1.0"
          /></label>
        </div>
        <div>
          <label
            >D<input type="range" min="0" max="2" step="0.05" value="1.0"
          /></label>
        </div>
        <div>
          <label
            >S<input type="range" min="0" max="1" step="0.05" value="0.5"
          /></label>
        </div>
        <div>
          <label
            >R<input type="range" min="0" max="3" step="0.05" value="1.5"
          /></label>
        </div>
      </div>
    </b-container>
  </div>
</template>

<script>
import * as Tone from "tone";
import Navbar from "@/components/Navbar.vue";
import { mapState } from "vuex";

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
    ...mapState(["notas"]),
  },
  methods: {
    tocarNota(elem) {
      let synth = new Tone.PolySynth().toDestination();
      synth.triggerAttackRelease(elem, "8n");
      console.log(elem);
      console.log(synth.get());
    },
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
.alteracion {
  width: 25%;
  background-image: radial-gradient(#5d5d5d, black);
  color: #fff;
}
.natural:hover {
  background-color: black;
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

.secuencia {
  border: #fff;
  min-height: 10rem;
  margin-top: 7rem;
}


</style>
