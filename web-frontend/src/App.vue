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
        <!-- 
          We dont need to pass these, but this is just so the app doesnt crash for now
          TODO: refactor audio player n shit
        -->
        <router-view 
          @playEpisode="queueStore.setCurrentEpisode" 
          @addToQueue="queueStore.addEpisode"
          @updateQueue="queueStore.reorderQueue">
        </router-view>
      </div>
    </div>

    <div id="footer-area">
      <AppAudioPlayer 
        :episode="currentEpisode" 
        @toggleQueue="toggleQueue"
        @playNextEpisode="queueStore.playNext"
        @playPreviousEpisode="queueStore.playPrevious"
      />

      <!--
        QueueController is still toggled by showQueue,
        but the data inside it is read from the store -> no more queue prop passing
      -->
      <QueueController 
        v-if="showQueue" 
        :currentEpisode="currentEpisode"
      />
    </div>
  </div>
</template>

<script>
import "@fortawesome/fontawesome-free/css/all.css"
import AppTopBar from "@/components/AppTopBar.vue"
import AppSidenav from "@/components/AppSidenav.vue"
import AppAudioPlayer from "@/components/AppAudioPlayer.vue"
import QueueController from "@/components/QueueController.vue"
import { mapStores } from "pinia"
import { useQueueStore } from "@/stores/queue"

export default {
  name: 'App',
  data() {
    return {
      showQueue: false
    }
  },
  computed: {
    ...mapStores(useQueueStore), // access queueStore easily
    /*
     * convenient getters
     */
    queue() {
      return this.queueStore.queue
    },
    currentEpisode() {
      return this.queueStore.currentEpisode
    }
  },
  methods: {
    toggleQueue() {
      this.showQueue = !this.showQueue
    }
  },
  async mounted() {
    // if first time / reload, sync with server / local storage
    await this.queueStore.initQueue()

    // recent searches still in local storage for now
    if (localStorage.getItem('recentSearches') === null) {
      localStorage.setItem('recentSearches', JSON.stringify([]))
    }
  },
  watch: {
    queue(newQueue) {
      this.updateQueue(newQueue)
      console.log('queue updated, new queue:', newQueue)
      console.log("this.queue", this.queue)
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
  justify-content: flex-start;
  align-items: center;
  overflow-y: hidden;
}

#sidenav-area, #main-area {
  padding: 1%;
  margin: 0.4%;
  background: linear-gradient(#121212, #090909);
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
