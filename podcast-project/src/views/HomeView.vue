<template>
  <div id="home-view-container">

    <div v-if="recentlyPlayedPodcasts.length > 0" id="recently-played-area">
      <h1>Pick up where you left off:</h1>
      <h3>Recently Played</h3>
      <PodcastList :podcasts="recentlyPlayedPodcasts" @toggleExpand="toggleExpand"/>
    </div>
    
    <div id="latest-podcast-area">
      <h1>
        Latest Podcasts
        <i class="fas fa-clock"></i>
      </h1>
      <PodcastList :podcasts="latestPodcasts" @toggleExpand="toggleExpand"/>
    </div>

    <TopPodcasts/>

  </div>
</template>

<script setup>
import TopPodcasts from '../components/TopPodcasts.vue'
import PodcastList from '../components/PodcastList.vue'
</script>

<script>
export default {
  data() {
    return { 
      latestPodcasts: [],
      recentlyPlayedPodcasts: [],
      isLoading: false,
      podsExpanded: false
    }
  },
  mounted() {
    this.getLatestPodcasts()
    this.getRecentlyPlayedPodcasts()
  },
  methods: {
    async getLatestPodcasts() {
      try {
        this.isLoading = true
        const url = 'https://api.fyyd.de/0.2/podcast/latest/?count=8'

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
          image: podcast.imgURL,
          url: podcast.url
        }))

        this.latestPodcasts = fetchedPods
        console.log("Latest Podcasts fetched: ", this.latestPodcasts)
      } catch (err) {
        console.error('Podcast could not be fetched.', err)
      } finally {
        this.isLoading = false
      }
    },
    async getRecentlyPlayedPodcasts() {
      this.isLoading = true
      let recentlyPlayedIds = JSON.parse(localStorage.getItem('recentlyPlayed') || '[]')

      try {
        const podcasts = await Promise.all(recentlyPlayedIds.map(async id => {
          let url = new URL('https://api.fyyd.de/0.2/podcast/')
          url.searchParams.append('podcast_id', id)

          const response = await fetch(url)
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }

          const body = await response.json()
          return {
            id: body.data.id,
            title: body.data.title,
            imgURL: body.data.imgURL,
            artist: body.data.author,
            url: body.data.htmlURL
          }
        }))
        this.recentlyPlayedPodcasts = podcasts
      } catch (error) {
        console.error('Failed to fetch recently played podcasts:', error.message)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
#home-view-container {
  overflow-y: auto;
  max-height: 100%;
  box-sizing: border-box;
}

i {
  color: #1DB954;
}
</style>