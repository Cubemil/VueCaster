<template>
  <div id="app">
    <div id="sidenav">
      <Sidenav/>
    </div>
    <div class="main-screen">
      <router-view></router-view>
    </div>
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
  margin: 0;
  padding: 0;
  background: #000000;
}

.main-screen {
  position: fixed;
  top: 10px;
  left: 274px;
  width: calc(100% - 284px); /* 274px left margin + 10px right margin */
  height: calc(100% - 20px); /* 10px top + 10px bottom */
  padding-right: 10px;
  box-sizing: border-box; /* Include padding in the width calculation */
  overflow-y: auto; /* Allows scrolling if content overflows */
  border-radius: 10px;
}

#sidenav {
  position: fixed;
  top: -12px;
  margin: 6px;
  font-size: 16px;
  font-weight: bold;
}

</style>
