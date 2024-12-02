<template>
  <div id="top-podcasts-view-container">
    
    <h1>
      Hot Podcasts Right Now
      <i class="fas fa-fire"></i>
    </h1>

    <div v-if="isLoading" id="loading-area">
      <i class="fas fa-spinner fa-spin" id="loading-indicator"></i>
      Loading podcasts...
    </div>

    <div id="head-area">
      <button id="refresh-button" @click="getHotPodcasts">
        <i id="refresh-icon" class="fas fa-refresh"></i>
        Refresh
      </button>
    </div>
    
		<PodcastShelf v-if="!podsExpanded" :podcasts="hotPodcasts" @toggleExpand="toggleExpand"/>
    <PodcastList v-if="podsExpanded" :podcasts="hotPodcasts" @toggleExpand="toggleExpand"/>
  </div>
</template>

<script setup>
import PodcastShelf from '../components/PodcastShelf.vue'
import PodcastList from '../components/PodcastList.vue'
</script>

<script>
export default {
  data() {
    return { 
      hotPodcasts: [],
      isLoading: false,
			podsExpanded: false
    }
  },
  mounted() {
    this.getHotPodcasts()
	},
  methods: {
    async getHotPodcasts() {
      try {
        this.isLoading = true
        const url = 'https://api.fyyd.de/0.2/feature/podcast/hot/?count=50'
        const response = await fetch(url)

        if (!response.ok)
          throw new Error('Network response was not ok', response.statusText)

        const body = await response.json()
        if (!body.data)
          throw new Error('No data found in response body')

        const fetchedPods = body.data.map(podcast => ({
          id: podcast.id,
          title: podcast.title,
          author: podcast.author,
          image: podcast.layoutImageURL,
          url: podcast.url
        }))

        this.hotPodcasts = fetchedPods
        this.isLoading = false
      } catch (err) {
        console.error('Podcast could not be fetched.', err)
      }
    },
    toggleExpand() {
      this.podsExpanded = !this.podsExpanded
    }
  }
}
</script>

<style scoped>
#top-podcasts-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  padding: 0;
  box-sizing: border-box;
  overflow-x: hidden;
  background: transparent;
  color: #ffffff;
  overflow-y: auto;
  align-items: flex-start;
}

#refresh-button {
  background-color: #1DB954;
  margin-left: 1%; /* Align it similarly to Latest Podcasts */
  color: #ffffff;
  border: none;
  padding: 10px 20px; /* Adjust padding to be consistent */
  font-size: 1em;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#refresh-button:hover {
  background-color: #5efe58;
  transform: scale(1.04);
}

#refresh-icon {
  color: #fff;
  margin-right: 2%;
}

#loading-area {
  display: flex;
  font-size: 2em;
  flex-direction: column;
  align-items: center;
  margin-left: 30vw;
  color: #888;
}

#loading-indicator {
  font-size: 1.5em;
  margin-bottom: 2%;
}

i {
  color: #1DB954;
}

</style>

