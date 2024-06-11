// Vue file (component) = HTML (template) + JavaScript (script) + CSS (style)

<template>
  <div class="app">
    <div class="navbar"><Navbar/></div>
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


.navbar {
  position: fixed;
  top: 0;
  z-index: 100%;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
</style>

