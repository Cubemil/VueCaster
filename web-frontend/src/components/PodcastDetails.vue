<template>
  <div id="podcast-detailed-view-container" v-if="data && data.title">
    <img :src="data.imgURL" alt="Podcast Image" id="podcast-image"/>

    <button 
      @click="toggleLike"
      class="action-button"
      id="like-button"
      :aria-label="liked ? 'Unlike podcast' : 'Like podcast'"
      :class="{ 'active-button' : liked }"
    >
      <i :class="liked ? 'fas fa-heart' : 'far fa-heart'"></i>
      <span v-if="liked">Liked</span>
      <span v-else>Like</span>
    </button>
    
    <h1>{{ data.title }}</h1>
    <h2>{{ data.author || 'Author Unknown' }}</h2> 
    <a :href="data.htmlURL" target="_blank">Link to Podcast: {{ data.htmlURL }}</a>
    <p v-html="data.description"></p>

    <div id="visualization">
      <p>Language: {{ getLanguage() }}</p>
      <p>Average episode length: {{ data.stats.medianduration_string }}</p>
      <p>Episode count: {{ data.episode_count }}</p>
      <p>Last publication: {{ new Date(data.lastpub).toLocaleDateString() }}</p>
      <p>Publication interval: {{ getPublicationInterval() }}</p>
      <p>Complete duration: {{ Math.round(data.stats.complete_duration_value / 60)}}h</p>
    </div>
  </div>

  <div v-else id="loading-area">
    <i class="fas fa-spinner fa-spin" id="loading-indicator"></i>
    Loading podcast details
  </div>
</template>

<script>
import { useLikedPodcastsStore } from '../stores/likedPodcasts'
export default {
  props: {
    data: {}
  },
  data() {
    return {
      liked: false
    }
  },
  watch: {
    data(newData) {
      if (newData) {
        this.checkIfLiked()
      }
    }
  },
  mounted() {
    this.checkIfLiked()
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    getLanguage() {
      switch (this.data.language) {
        case 'en':
          return 'English'
        case 'de':
          return 'German'
        case 'fr':
          return 'French'
        case 'es':
          return 'Spanish'
        default:
          return 'Unknown Language'
      }
    },
    getPublicationInterval() {
      const interval_type = this.data.stats.pubinterval_type
      const interval_value = this.data.stats.pubinterval_value

      if (!interval_type || !interval_value || interval_value < 1 || interval_type < 1) 
        return 'No regular interval'
      
      switch (interval_type) {
        case 1:
          if (interval_value === 1 || interval_value === 0)
            return 'Daily'
          else
            return `Every ${interval_value} days`
        case 2:
          if (interval_value === 7 || interval_value === 0)
            return 'Weekly'
          else
            return `Every ${interval_value} weeks`
        case 3:
          return 'Bi-weekly'
        default:
          return 'No regular interval'
      }
    },
    async checkIfLiked() {
      // const likedPodcasts = JSON.parse(localStorage.getItem('likedPodcasts') || '[]')
      const store = useLikedPodcastsStore()
      if (this.data) {
        this.liked = await store.isPodcastLiked(this.data.id)
      }
    },
    async toggleLike() {
      // const likedPodcasts = JSON.parse(localStorage.getItem('likedPodcasts') || '[]')
      if (!this.data) return
      const store = useLikedPodcastsStore()

      console.log("Toggling like for podcast", this.data.id, "from", this.liked, "to", !this.liked)

      if (!this.liked) {
        await store.addLikedPodcast(this.data.id)
        this.liked = false
      } else {
        await store.removeLikedPodcast(this.data.id)
        this.liked = true
      }
    },
    async handleStorageChange(event) {
      if (event.key === 'likedPodcasts')
        await this.checkIfLiked()
    }
  }
}
</script>

<style scoped>
#podcast-detailed-view-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2%;
  color: white;
  background-color: transparent;
  cursor: default;
}

#podcast-image {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 20px;
}

h1 {
  font-size: 2em;
  font-weight: bold;
}

h2 {
  font-size: 1.2em;
  font-weight: normal;
  color: #b3b3b3;
}

a {
  text-decoration: none;
  color: #1DB954;
  margin-bottom: 20px;
  display: block;
}

a:hover {
  text-decoration: underline;
}

p {
  text-align: left;
  line-height: 1.6;
}

#visualization {
  margin-top: 20px;
  width: 100%;
  text-align: left;
  padding-top: 20px;
}

#visualization p {
  color: #b3b3b3;
}

#loading-area {
  font-size: 200%;
  margin: auto;
  color: #888;
}

#loading-area i {
  margin: 0.5em;
}

.action-button {
  background-color: #5d635f;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1.5em;
  border-radius: 25px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: #1DB954;
  scale: 1.1;
}

.active-button {
  background-color: #1DB954;
  color: #ffffff;
}

.action-button span {
  margin-left: 0.5em;
  color: #ffffff;
}

</style>
