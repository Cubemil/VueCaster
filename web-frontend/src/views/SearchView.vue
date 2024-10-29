<template>
  <div id="search-view-container">

    <div id="top">

      <div class="pagination-top">
        <button class="pagination-button" id="previous-button"
                aria-label="Previous page" @click="back">
          <i class="fas fa-chevron-left"></i>
        </button>

        <button class="pagination-button"
                id="next-button" aria-label="Next page" @click="forward">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <div id="search-bar-area">
        <AppSearchBar @search-performed="updatePodcasts" @clear-search="clearPodcasts"/>
      </div>

    </div>

    <div v-if="searchedPodcasts.length > 0" id="recent-search-list">
      <RecentSearchList/>
    </div>

    <div id="categories">
      <CategorySearchList @search-performed="updatePodcasts"/>
    </div>

    <PodcastList id="podcasts" :podcasts="podcasts"/>
  </div>
</template>

<script setup>
import AppSearchBar from '@/components/AppSearchBar.vue'
import PodcastList from '@/components/PodcastList.vue'
import CategorySearchList from "@/components/CategorySearchList.vue"
import RecentSearchList from "@/components/RecentSearchList.vue"
</script>

<script>
export default {
  data() {
    return {
      podcasts: [],
      searchedPodcasts: []
    }
  },
  methods: {
    updatePodcasts(podcasts) {
      this.podcasts = podcasts
    },
    clearPodcasts() {
      this.podcasts = []
    },
    forward() {
      history.forward()
    },
    back() {
      history.back()
    }
  },
  mounted() {
    const storedPodcasts = JSON.parse(localStorage.getItem('clickedPodcastIds'))
    if (storedPodcasts) {
      this.searchedPodcasts = storedPodcasts
    }
  },
}
</script>

<style scoped>
#search-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  color: #ffffff;
  background: transparent;
  overflow-x: hidden;
  position: relative;
}

#categories {
  display: flex;
  justify-content: center;
  width: 100%;
}

#search-bar-area {
  position: relative;
}

#podcasts {
  margin-top: 1.5em;
}

.pagination-top {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 0.5em;
  margin-right: 1em;
}

.pagination-button {
  font-size: 90%;
  color: #ffffff;
  background: #242424;
  border: none;
  border-radius: 50%;
  padding: 1.25em;
  margin: 0.35em;
  width: 1.25em;
  height: 1.25em;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.3s;
}

.pagination-button:hover {
  background: #1DB954;
}

#top {
  display: flex;
  left: 1px;
}
</style>
