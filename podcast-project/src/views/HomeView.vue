<template>
  <div id="home-view-container">
    <h1 id="welcome-message">Welcome back! Here are some recommended podcasts for you!</h1>
    
    <div id="head-area">
      <h1 id="subheading">These are the top 30 hot podcasts right now:</h1>
      <button id="refresh-button" @click="getPodcastData">Refresh</button>
    </div>
    
    <PodcastList :podcasts="podcasts"/>
  </div>
</template>

<script>
import PodcastList from '../components/PodcastList.vue';

export default {
  name: 'HomeView',
  components: { PodcastList },
  data() {
    return {
      podcasts: []
    }
  },
  mounted() {
    this.getPodcastData()
  },
  methods: {
    async getPodcastData() {
      try {
        const url = 'https://api.fyyd.de/0.2/feature/podcast/hot/?count=30'
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Network response was not ok', response.statusText)
        }

        const body = await response.json()

        if (!body.data) {
          throw new Error('No data found in response body')
        }

        const fetchedPods = body.data.map(podcast => ({
          id: podcast.id,
          title: podcast.title,
          author: podcast.author,
          image: podcast.layoutImageURL,
          url: podcast.url
        }))

        this.podcasts = fetchedPods
        console.log("Podcasts fetched: ", this.podcasts)
      } catch (err) {
        console.error('Podcast could not be fetched.', err)
      }
    }
  }
}
</script>

<style scoped>
#home-view-container {
  position: fixed;
  display: flex;
  flex-direction: column;
  top: 10px;
  left: 274px;
  width: calc(100% - 284px); /* 274px left margin + 10px right margin */
  height: calc(100% - 20px); /* 10px top + 10px bottom */
  padding-right: 10px;
  box-sizing: border-box; /* Include padding in the width calculation */
  overflow-y: auto; /* Allows scrolling if content overflows */
  border-radius: 10px;
  background-color: #121212;
  color: #ffffff;
  align-items: flex-start;
}

#welcome-message {
  font-size: 2.2em;
  font-weight: bold;
  margin-bottom: 20px;
  color: #1DB954; /* Spotify Green */
}

#subheading {
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
  background-color: #1DB954; /* Spotify Green */
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#refresh-button:hover {
  background-color: #1aa34a;
}

</style>
