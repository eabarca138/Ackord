
<template>
    <footer mt-auto>
        <b-icon icon="github" class="mx-auto h3" variant="light"></b-icon>
    </footer>
</template>

<script>
    export default {
        name: "Footer"
    }
</script>

<style lang="scss" scoped>
@import "@/assets/_variables.scss";

footer{

    width: 100%;
    background: $color1;
        padding-top: 1.2rem;
    padding-bottom: .6rem;
}

@media only screen and (min-width: 990px) {
  footer{
      position: absolute;
      bottom: 0;
  }
}

</style>


