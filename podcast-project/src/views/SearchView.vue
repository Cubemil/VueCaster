<template>
  <div id="search-view-container">
    <div id="search-bar-area">
      <AppSearchBar @change="displayCategories" @search-performed="updatePodcasts" @clear-search="clearPodcasts"/>
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
</script>

<script>
export default {
  data() {
    return {
      podcasts: []
    }
  },
  methods: {
    updatePodcasts(podcasts) {
      this.podcasts = podcasts
      document.getElementById("categories").style.display = "none";
    },
    clearPodcasts() {
      this.podcasts = []
      document.getElementById("categories").style.display = "block";
    },
    displayCategories() {

    }
  }
}
</script>

<style scoped>
#search-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  height: 12em;
}

#search-bar-area {
  position: absolute;
  left: 1px;
}

#podcasts {
  margin-top: 4.5em;
}
</style>

