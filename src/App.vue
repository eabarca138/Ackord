<template>
  <div id="app">
    <router-view />
  <Footer />
  </div>
</template>

<script>
import Footer from "@/components/Footer.vue";

export default{
    components: {
    Footer,
  },
}
</script>


<style lang="scss">
@import "@/assets/_variables.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body{
  background-repeat: no-repeat; 
  background-image: linear-gradient($color2, $color1);
}

html,body,#app{
 width: 100%;
 height: 100%;
 overflow-x: hidden;
}
</style>
