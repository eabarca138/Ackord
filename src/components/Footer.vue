<template>
  <footer mt-auto>
    <a href="https://github.com/eabarca138"
      ><b-icon icon="github" class="mx-auto h3" variant="light"></b-icon
    ></a>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

footer {
  width: 100%;
  background: $color1;
  padding-top: 1.2rem;
  padding-bottom: 0.6rem;
}

@media only screen and (min-width: 990px) {
  footer {
    position: absolute;
    bottom: 0;
  }
}
</style>
