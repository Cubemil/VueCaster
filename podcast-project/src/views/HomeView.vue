<template>
  <div class="container">
    <h1>Welcome back! We have some recommended podcasts for you!</h1>
    <div id="refresh">
      <button id="refresh-button">Refresh</button>
    </div>
    <PodcastList :podcasts="podcasts"/>    
  </div>
</template>

<script>
import PodcastList from '../components/PodcastList.vue';

export default {
  name: 'HomeView',
  components: {PodcastList},
  data() {
    return {
      podcasts: []
    }
  },
  methods: {
    updatePodcasts(podcasts) {
      this.podcasts = podcasts;
    },
    clearPodcasts() {
      this.podcasts = [];
    }
  }
}
</script>

<style scoped>
.container {
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

.container h1 {
  text-align: left;
  font-size: 2em;
}

#refresh-button {
  position: absolute;
  left: 20px;
  background-color: #ffffff;
  color: #000000;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#refresh-button:hover {
  background-color: #f2f2f2;
}

</style>
