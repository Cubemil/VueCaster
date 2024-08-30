<template>
  <div id="podcast-list-container">

    <button v-if="section"
      id="show-shelf-button"
      @click="toggleExpand"
    >
      <i class="fas fa-arrow-left"></i>
      Show shelf
    </button>

    <div v-if="visiblePodcasts.length > 0" id="podcast-list">
      <PodcastCard
        v-for="podcast in visiblePodcasts"
        :key="podcast.id"
        :podcastId="podcast.id"
        :image="podcast.image"
        :podcastTitle="podcast.title"
        :podcastAuthor="podcast.author"
        :isLiked="isPodcastLiked(podcast.id)"
      />
    </div>

    <div class="pagination-bottom" v-if="podcasts.length >= 15">
      <button :disabled="currentPage === 0" @click="firstPage" class="pagination-button" id="first-button"
              aria-label="First page">
        <i class="fas fa-angle-double-left"></i>
      </button>
      <button :disabled="currentPage === 0" @click="previousPage" class="pagination-button" id="previous-button"
              aria-label="Previous page">
        <i class="fas fa-chevron-left"></i>
      </button>
      <p id="current-page-text">{{ currentPage + 1 }}/{{ totalPages + 1 }}</p>
      <button :disabled="podcasts.length <= (currentPage + 1) * 15" @click="nextPage" class="pagination-button"
              id="next-button" aria-label="Next page">
        <i class="fas fa-chevron-right"></i>
      </button>
      <button :disabled="currentPage === totalPages" @click="lastPage" class="pagination-button" id="last-button"
              aria-label="Last page">
        <i class="fas fa-angle-double-right"></i>
      </button>
    </div>

    <p id="result-counter-text" v-if="podcasts.length > 0">Showing {{ podcasts.length }} results</p>

  </div>
</template>

<script setup>
import PodcastCard from './PodcastCard.vue'
</script>

<script>
export default {
  props: {
    podcasts: {type: Array, required: true},
    section: {type: String, required: true}
  },
  data() {
    return {
      visiblePodcasts: [],
      currentPage: 0,
      totalPages: Math.ceil(this.podcasts.length / 15) - 1
    }
  },
  watch: {
    podcasts() {
      this.currentPage = 0
      this.totalPages = Math.ceil(this.podcasts.length / 15) - 1
      this.updateVisiblePodcasts()
    },
    currentPage() {
      this.updateVisiblePodcasts()
    }
  },
  mounted() {
    this.updateVisiblePodcasts()
  },
  methods: {
    updateVisiblePodcasts() {
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 15, (this.currentPage + 1) * 15)
    },
    nextPage() {
      this.currentPage++
      this.updateVisiblePodcasts()
    },
    previousPage() {
      this.currentPage--
      this.updateVisiblePodcasts()
    },
    firstPage() {
      this.currentPage = 0
      this.updateVisiblePodcasts()
    },
    lastPage() {
      this.currentPage = this.totalPages
      this.updateVisiblePodcasts()
    },
    isPodcastLiked(podcastId) {
      const likedPodcasts = JSON.parse(localStorage.getItem('likedPodcasts') || '[]')
      return likedPodcasts.includes(podcastId)
    },
    toggleExpand() {
      this.$emit('toggleExpand', this.section)
    }
  }
}
</script>

<style scoped>
#podcast-list-container {
  width: 100%;
  overflow-y: auto;
  background: transparent;
}

#podcast-list {
  display: flex;
  flex-wrap: wrap;
}

#current-page-text {
  color: #A7A7A7;
  font-size: 1.25em;
  margin-left: 1%;
  margin-right: 1%;
}

.pagination-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-button {
  font-size: 100%;
  color: #ffffff;
  background: #646060;
  border: none;
  border-radius: 50%;
  padding: 1.25em;
  margin: 0.25em;
  width: 1.25em;
  height: 1.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pagination-button:hover {
  background: #1DB954;
}

.pagination-button:disabled {
  background: #343333;
  color: #646060;
  cursor: not-allowed;
}

#result-counter-text {
  margin: 0;
  width: 100%;
  text-align: center;
  color: #A7A7A7;
  font-size: 1em;
}

#show-shelf-button {
  background: #646060;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  font-size: 1em;
  border-radius: 20px;
  margin: 1em 2em;
  cursor: pointer;
  transition: all 0.3s ease;
}

#show-shelf-button:hover {
  background-color: #5efe58;
  scale: 1.05;
}
</style>
