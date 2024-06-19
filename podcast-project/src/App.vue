// Vue file (component) = HTML (template) + JavaScript (script) + CSS (style)

<template>
  <div id="app">
    <Sidenav/>
    <router-view></router-view>
  </div>
</template>

<script>
import Sidenav from "@/components/Sidenav.vue";

export default {
  name: 'App',
  components: {Sidenav}
}
</script>

<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #fdfdfd;
}

body {
  background: #000000;
  margin: 0;
  padding: 0;
}
</style>

