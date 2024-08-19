<template>
  <div id="app-container">
    <div class="top-bar">
      <AppTopBar/>
    </div>
    <div id="content">
      <div id="sidenav-area">
        <AppSidenav ref="sidenav"/>
      </div>
      <div id="main-area">
        <router-view 
          @playEpisode="setCurrentEpisode" 
          @addToQueue="addToQueue"
          @updateQueue="updateQueue">
        </router-view>
      </div>
    </div>
    <div id="footer-area">
      <AppAudioPlayer 
        :episode="currentEpisode" 
        @toggleQueue="toggleQueue"
      />
      <QueueController 
        v-if="showQueue" 
        :queue="queue"
        :currentEpisode="currentEpisode"
        @playEpisode="setCurrentEpisode"
        @removeFromQueue="removeFromQueue"
        @removeAllFromQueue="removeAllFromQueue" 
        @update:queue="updateQueue"
      />
    </div>
  </div>
</template>

<script setup>
import '@fortawesome/fontawesome-free/css/all.css'
import AppTopBar from "@/components/AppTopBar.vue"
import AppSidenav from "@/components/AppSidenav.vue"
import AppAudioPlayer from "@/components/AppAudioPlayer.vue"
import QueueController from "@/components/QueueController.vue"
</script>

<script>
export default {
  data() {
    return {
      currentEpisode: null,
      queue: JSON.parse(localStorage.getItem('queue') || '[]'),
      showQueue: false
    }
  },
  methods: {
    setCurrentEpisode(episode) {
      this.currentEpisode = episode
    },
    addToQueue(episode) {
      this.queue.push(episode)
      localStorage.setItem('queue', JSON.stringify(this.queue))
    },
    removeFromQueue(index) {
      this.queue.splice(index, 1)
      localStorage.setItem('queue', JSON.stringify(this.queue))
    },
    removeAllFromQueue() {
      this.queue = []
      localStorage.setItem('queue', JSON.stringify(this.queue))
    },
    toggleQueue() {
      this.showQueue = !this.showQueue
    },
    updateQueue(newQueue) {
      this.queue = newQueue 
      localStorage.setItem('queue', JSON.stringify(newQueue))
    },
    async getCategories() {
      try {
        const response = await fetch('https://api.fyyd.de/0.2/categories')
        const data = await response.json()
        localStorage.setItem('categories', JSON.stringify(data.data))
      } catch (error) {
        console.error('Failed to fetch categories:', error.message)
      }
    }
  },
  mounted() {
    if (localStorage.getItem('categories') === null) this.getCategories()
    if (localStorage.getItem('favourites') === null) localStorage.setItem('favourites', JSON.stringify([]))
  },
  watch: {
    queue(newQueue) {
      localStorage.setItem('queue', JSON.stringify(newQueue))
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
  overflow: hidden;
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
  flex: 83%;
  overflow: hidden;
}

#sidenav-area {
  flex: 10%;
  border-radius: 15px;
  display: flex;
  justify-content: left;
}

#main-area {
  flex: 90%;
  border-radius: 10px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#sidenav-area, #main-area {
  padding: 1%;
  margin: 0.4%;
  background: linear-gradient(#121212, #000000);
  background: #121212;
}

#footer-area {
  flex: 12%;
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

@media screen and (max-width: 768px) {
  #sidenav-area {
    width: 10%;
    justify-content: center;
  }
}
</style>
