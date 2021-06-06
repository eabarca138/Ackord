<template>
  <b-navbar toggleable="lg" type="dark" class="navbar" fixed="top">
    <b-container>
      <b-navbar-brand to="/home">Ackord</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav style="margin-left: auto">
          <b-nav-item
            ><router-link to="/registro">Registro</router-link></b-nav-item
          >
          <b-nav-item @click="logout">Log out</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
  import Firebase from "firebase"

export default {
  name: "Navbar",
  methods: {
    logout() {
      Firebase.auth()
        .signOut()
        .then((accept) => {
          console.log(accept);
          this.$router.push("login");
        });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/_variables.scss";
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
.navbar {
  background: $color1;
}
</style>
