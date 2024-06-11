// Vue file (component) = HTML (template) + JavaScript (script) + CSS (style)

<template>
  <div class="app">
    <Navbar/>
    <Background/>
    <router-view></router-view>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Background from './components/Background.vue';

export default {
  name: 'App',
  components: {Navbar, Background}
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
  margin-top: 15%;
}
</style>

