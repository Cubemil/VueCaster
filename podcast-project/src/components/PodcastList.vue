<template>
  <div id="podcast-list-container">
    
    <div class="pagination-top" v-if="podcasts.length >= 15">
      <button :disabled="currentPage === 0" @click="previousPage" class="pagination-button" id="previous-button" aria-label="Previous page">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button :disabled="podcasts.length <= (currentPage + 1) * 15" @click="nextPage" class="pagination-button" id="next-button" aria-label="Next page">
        <i class="fas fa-chevron-right"></i>
      </button>
      <p id="current-page-text">{{ currentPage + 1 }}/{{ totalPages + 1 }}</p>
    </div>

    <div v-if="visiblePodcasts.length > 0" id="podcast-list">
      <PodcastCard
        v-for="(podcast, index) in visiblePodcasts"
        :key="index"
        :podcast="podcast"
        :podcastId="podcast.id"
        :image="podcast.image"
        :podcastTitle="podcast.title"
        :podcastAuthor="podcast.author"/>
    </div>

    <div class="pagination-bottom" v-if="podcasts.length >= 15">
      <button :disabled="currentPage === 0" @click="previousPage" class="pagination-button" id="previous-button" aria-label="Previous page">
        <i class="fas fa-chevron-left"></i>
      </button>
      <p id="current-page-text">{{ currentPage + 1 }}/{{ totalPages + 1 }}</p>
      <button :disabled="podcasts.length <= (currentPage + 1) * 15" @click="nextPage" class="pagination-button" id="next-button" aria-label="Next page">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

  </div>
</template>

<script setup>
import PodcastCard from './PodcastCard.vue'
</script>

<script>
export default {
  props: {
    podcasts: { type: Array, required: true }
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
      this.currentPage = 0;
      this.totalPages = Math.ceil(this.podcasts.length / 15) - 1;
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
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 15, (this.currentPage + 1) * 15)
    },
    previousPage() {
      this.currentPage--
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 15, (this.currentPage + 1) * 15)
    },
  }
}
</script>

<style scoped>
#podcast-list-container {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
  background: transparent;
}

#podcast-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  flex-grow: 1;
  background: transparent;
}

.pagination-top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 5%;
}

#current-page-text {
  color: #A7A7A7;
  font-size: 1.5em;
  margin-left: 1%;
  margin-right: 1%;
}

.pagination-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-button {
  font-size: 170%;
  color: #ffffff;
  background: #646060;
  border: none;
  border-radius: 50%;
  padding: 0.5em;
  margin: 0.1em;
  width: 2em;
  height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.pagination-button:disabled {
  background: #343333;
  color: #646060;
  cursor: not-allowed;
}

</style>
