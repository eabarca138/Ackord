<template>
  <div>
    <Navbar />

      <b-container class="d-flex justify-content-end volver">
        <b-button to="/home" size="md" class="my-1 rounded btn-volver" variant="dark">
          <b-icon icon="arrow-return-left" class="mx-1"></b-icon
          >Volver</b-button
        >
      </b-container>

      <Tabla :progresiones="progresiones"/>

  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Tabla from "@/components/Tabla.vue";
import { mapState  } from "vuex";

export default {
  name: "Registro",
  components: {
    Navbar,
    Tabla
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
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";


.btn-volver{
  background-color: $color1;
  &:hover{
    background-color: rgb(27, 42, 88);
  }
}

.volver{
    padding-top: 6rem;
}

</style>
