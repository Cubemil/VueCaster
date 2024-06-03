// Vue file (component) = HTML (template) + JavaScript (script) + CSS (style)

<template>
  <Homepage/>
</template>

<script>
import Homepage from "/src/components/Homepage.vue";

export default {
  name: 'App',
  components: {Homepage}
}
</script>


<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  color: #fdfdfd;
  margin-top: 60px;
}
</style>

