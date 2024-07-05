<template>
  <div id="app-container">
    <div id="content">
      <div id="app-sidenav">
        <AppSidenav/>
      </div>

      <div id="main-content">
        <router-view></router-view>
      </div>
    </div>

    <div id="footer">
      <AppAudioPlayer/>
    </div>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';

import AppSidenav from "@/components/AppSidenav.vue";
import AppAudioPlayer from "./components/AppAudioPlayer.vue";

export default {
  name: 'App',
  components: { AppSidenav, AppAudioPlayer }
}
</script>

<style>
#app-container {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fdfdfd;
  background: #000000;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#content {
  display: flex;
  flex: 1 0 80%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
}

#app-sidenav {
  width: 15%;
  background: #121212;
  border-radius: 0 10px 0 0;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

#main-content {
  width: 85%;
  background: #181818;
  border-radius: 10px 0 0 0;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

#footer {
  flex: 0 0 20%;
  background: #282828;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0 0 10px 10px;
}

/************* scrollbar *************/

/* width */
::-webkit-scrollbar {
  width: 12px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #5a5959;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #6e6d6d;
}
</style>
