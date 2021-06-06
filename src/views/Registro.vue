<template>
  <div>
    <Navbar />


  <b-container class="tabla">
    <b-table striped hover :items="items" :fields="fields">
      <template #cell(actions)="row">
        <b-button
          size="sm"
          @click="editar(row.item)"
          class="my-1 me-4"
          variant="primary"
          >Actualizar</b-button
        >

        <b-button size="sm" @click="borrar(row.item)" variant="danger"
          >Eliminar</b-button
        >
      </template>
    </b-table>
    </b-container>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
export default {
  name: "Registro",
  components: {
    Navbar,
  },
  data() {
    return {
      fields: ["#", "Progresiones", "envolvente de amplitud", "acción"],
      items: [
 
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.tabla {
  margin-top: 7rem;
}
</style>
