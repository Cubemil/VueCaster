<template>
  <div id="app-container">  <!-- column flex container for the meta layout (top bar, main content and footer)-->
    <div class="top-bar">
      <AppTopBar/>
    </div>

    <div id="content">      <!-- row flex container for the inner area layout (sidebar and main window)-->
      <div id="sidenav-area">
        <AppSidenav/>
      </div>
      <div id="main-area">
        <router-view></router-view>
      </div>
    </div>

    <div id="footer-area">
      <AppAudioPlayer/>
    </div>
  </div>
</template>

<script setup>
import '@fortawesome/fontawesome-free/css/all.css';

import AppTopBar from "@/components/AppTopBar.vue";
import AppSidenav from "@/components/AppSidenav.vue";
import AppAudioPlayer from "@/components/AppAudioPlayer.vue";
</script>

<script>
export default {
  mounted() {
    if (localStorage.getItem('categories') === null) {
      this.getCategories();
    }
		if (localStorage.getItem('favourites') === null) {
			localStorage.setItem('favourites', JSON.stringify([]));
		}
  },
  methods: {
    async getCategories() {
      try {
        const response = await fetch('https://api.fyyd.de/0.2/categories').then(response => response.json());

				if (response) {
					localStorage.setItem('categories', JSON.stringify(response.data));
				}
			} catch (error) {
				console.error('Failed to fetch categories:', error.message);
			}
		}
	}
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background: #000000;
  height: 100vh;
}

.top-bar {
  flex: 5%;
  margin-bottom: -0.5%;
}

#app-container {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #fdfdfd;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

#content {
  display: flex;
  flex-direction: row;
  flex: 85%;
  overflow: hidden;
}

#sidenav-area {
  flex: 10%;
  border-radius: 15px;
  display: flex;
}

#main-area {
  flex: 90%;
  border-radius: 10px;
}

#sidenav-area, #main-area {
  padding: 1%;
  margin: 0.5%;
  background: linear-gradient(#121212, #000000);
}

#footer-area {
  flex: 10%;
  display: flex;
  justify-content: center;
}

/************* scrollbar *************/

/* width */
::-webkit-scrollbar {
  width: 1em;
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
