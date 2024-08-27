<template>
  <div id="top-podcasts-view-container">
    <div id="head-area">
      <h1 id="heading">These are the top 50 hot podcasts right now:</h1>
      <button id="refresh-button" @click="getPodcastData">
        <i class="fas fa-refresh"></i>
        Refresh
      </button>
    </div>
    
    <div v-if="isLoading" id="loading-area">
      <i class="fas fa-spinner fa-spin" id="loading-indicator"></i>
      Loading podcasts...
    </div>
    
		<!-- <PodcastShelf v-if="!podsExpanded" :podcasts="podcasts" @toggleExpand="toggleExpand"/> -->
    <!-- <PodcastList v-if="podsExpanded" :podcasts="podcasts" @toggleExpand="toggleExpand"/> -->
    <PodcastList :podcasts="podcasts" @toggleExpand="toggleExpand"/>
    
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
      podcasts: [],
      isLoading: false,
			podsExpanded: false
    }
  },
  mounted() {
		this.getPodcastData()
	},
  methods: {
    async getPodcastData() {
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

        this.podcasts = fetchedPods
        console.log("Podcasts fetched: ", this.podcasts)
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
  height: 100%;
  overflow-y: auto;
  color: #ffffff;
  align-items: flex-start;
  background: transparent;
}

#heading {
  font-size: 1.5em;
  font-weight: normal;
  color: #ffffff;
}

#head-area {
  display: flex;
  justify-content: space-between;
  max-width: 90%;
  align-items: center;
  width: 100%;
}

#refresh-button {
  background-color: #1DB954;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#refresh-button:hover {
  background-color: #5efe58;
  scale: 1.1;
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
</style>