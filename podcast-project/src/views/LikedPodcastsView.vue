<template>
	<div v-if="likedPodcasts.length > 0" id="liked-podcasts-view-container">
    <div id="head-area">
			<h1 id="heading">Here are your liked podcasts:</h1>
    </div>
    
    <div v-if="isLoading" id="loading-area">
			<i class="fas fa-spinner fa-spin" id="loading-indicator"></i>
				Loading podcasts...
    </div>
    
    <PodcastList :podcasts="likedPodcasts" @toggleExpand="toggleExpand"/>
    
	</div>
  <div v-else id="liked-podcasts-view-container">
    <h1 id="heading">It seems like You haven't liked any podcasts yet. Here is some inspiration to get you going!</h1>
    <TopPodcasts/>
  </div>
</template>

<script setup>
import PodcastList from '../components/PodcastList.vue'
import TopPodcasts from '../components/TopPodcasts.vue'
</script>

<script>
export default {
data() {
    return { 
    	likedPodcasts: [],
    	isLoading: false,
      errorMessage: '',
    }
	},
	mounted() {
		this.loadLikedPodcasts()
	},
	methods: {
    async loadLikedPodcasts() {
      this.isLoading = true;
      this.errorMessage = ''
      const likedPodcastsIds = JSON.parse(localStorage.getItem('likedPodcasts') || '[]')

      try {
        const podcasts = await Promise.all(likedPodcastsIds.map(async (id) => {
          const url = new URL('https://api.fyyd.de/0.2/podcast/')
          url.searchParams.append('podcast_id', id)

          const response = await fetch(url)
          if (!response.ok)
            throw new Error('Network response was not ok')
          const body = await response.json()
          if (!body.data)
            throw new Error('No data found in response body')

          return {
            id: body.data.id,
            title: body.data.title,
            artist: body.data.author,
            image: body.data.imgURL,
            url: body.data.htmlURL
          }
        }))

        this.likedPodcasts = podcasts
        console.log('Liked Podcasts fetched: ', this.likedPodcasts)
      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    toggleExpand() {
    	this.podsExpanded = !this.podsExpanded
    }
	}
}
</script>

<style scoped>
#liked-podcasts-view-container {
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
  font-size: 2em;
  font-weight: normal;
  color: #1DB954;
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