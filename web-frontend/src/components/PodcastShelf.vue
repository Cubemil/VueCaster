<template>
  <div id="podcast-shelf-container">
    <div id="header">
      <div class="pagination-top" v-if="podcasts.length > visiblePodcasts.length">
        <button :disabled="currentPage === 0" @click="previousPage" class="pagination-button" id="previous-button" aria-label="Previous page">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button :disabled="currentPage === totalPages" @click="nextPage" class="pagination-button" id="next-button" aria-label="Next page">
          <i class="fas fa-chevron-right"></i>
        </button>
        <p id="current-page-text">{{ currentPage + 1 }}/{{ totalPages + 1 }}</p>
      </div>
      
      <button id="expand-button" @click="toggleExpand">Show all</button>
    </div>

    <div v-if="visiblePodcasts.length > 0" id="podcast-shelf">
      <PodcastShelfItem
        v-for="(podcast, index) in visiblePodcasts"
        :key="index"
        :podcast="podcast"
        :podcastId="podcast.id"
        :image="podcast.image"
        :podcastTitle="podcast.title"
        :podcastAuthor="podcast.author"
      />
    </div>
  </div>
</template>

<script setup>
import PodcastShelfItem from './PodcastShelfItem.vue'
</script>

<script>
export default {
  props: {
    podcasts: { 
      type: Array, 
      required: true,
      default: () => []
    },
    section: { 
      type: String
    }
  },
  data() { 
    return { 
      visiblePodcasts: [], 
      currentPage: 0,
      totalPages: 0,
      itemsPerRow: 0
    }
  },
  watch: {
    podcasts() {
      this.updatePagination()
    },
    windowWidth() {
      this.updatePagination()
    }
  },
  mounted() {
    window.addEventListener('resize', this.updatePagination)
    this.updatePagination()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updatePagination)
  },
  methods: {
    updatePagination() {
      if (!this.podcasts || this.podcasts.length === 0) {
        this.visiblePodcasts = []
        this.totalPages = 0
        return
      }
      
      const containerWidth = document.getElementById('podcast-shelf-container').clientWidth
      const itemWidth = 170 // width of single item (+ margins)

      this.itemsPerRow = Math.floor(containerWidth / itemWidth)
      this.totalPages = Math.ceil(this.podcasts.length / this.itemsPerRow) - 1

      this.updateVisiblePodcasts()
    },
    updateVisiblePodcasts() {
      const startIndex = this.currentPage * this.itemsPerRow
      const endIndex = startIndex + this.itemsPerRow
      this.visiblePodcasts = this.podcasts.slice(startIndex, endIndex)
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.updateVisiblePodcasts()
      }
    },
    previousPage() {
      if (this.currentPage > 0) {
        this.currentPage--
        this.updateVisiblePodcasts()
      }
    },
    toggleExpand() {
      this.$emit('toggleExpand', this.section)
    }
  },
  computed: {
    windowWidth() {
      return window.innerWidth
    }
  }
}
</script>

<style scoped>
#podcast-shelf-container {
  height: auto;
  background: transparent;
  width: 100%;
  max-height: 25em;
  overflow-y: hidden;
  overflow-x: hidden;
}

#podcast-shelf {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  background: transparent;
}

#header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

#expand-button {
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

#expand-button:hover {
  background-color: #5efe58;
  scale: 1.05;
}

.pagination-top {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-right: 5%;
}

#current-page-text {
  color: #A7A7A7;
  font-size: 1.25em;
  margin-left: 1%;
  margin-right: 1%;
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
</style>
