<template>
  <div class="home">
    <b-card style="max-width: 20rem" class="mx-auto mt-5">
    <h1>ACKORD</h1>
    <hr class="my-3">
      <b-form-input
        v-model="email"
        class="mb-2"
        type="email"
        placeholder="Correo electrónico"
        required
      ></b-form-input>

      <b-form-input
        v-model="password"
        class="mb-2"
        type="password"
        aria-describedby="password-help-block"
        placeholder="Contraseña"
      ></b-form-input>

      <b-button @click="login()" variant="primary" class="mt-2">Inicias sesión</b-button>

      <p class="mt-3 text-primary" @click="googleLogin"><u>Iniciar sesión con Google</u></p>
    </b-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  computed: {
    email: {
      get() {
        return this.$store.state.email;
      },

      set(value) {
        this.$store.commit("actualizarEmail", value);
      },
    },
    password: {
      get() {
        return this.$store.state.password;
      },

      set(value) {
        this.$store.commit("actualizarPassword", value);
      },
    },
  },
  methods: {
    ...mapActions(["login", "googleLogin"]),
  },
};
</script>

<style lang="scss" scoped>
u{
  cursor: pointer;
}
h1 {
  font-family: 'Saira Stencil One', cursive;
}
</style>
