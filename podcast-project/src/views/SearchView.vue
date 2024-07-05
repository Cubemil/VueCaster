<template>
  <div id="search-view-container">
    <div id="search-bar-container">
      <AppSearchBar id="search-bar" @search-performed="updatePodcasts" @clear-search="clearPodcasts"/>
    </div>
    <PodcastList :podcasts="podcasts"/>
    <div ref="categories">
      <CategorySearchList/>
    </div>
  </div>
</template>

<script>
import AppSearchBar from '../components/AppSearchBar.vue';
import PodcastList from '../components/PodcastList.vue';
import CategorySearchList from "@/components/CategorySearchList.vue";

export default {
  name: 'SearchView',
  components: {CategorySearchList, AppSearchBar, PodcastList},
  data() {
    return {
      podcasts: []
    }
  },
  methods: {
    updatePodcasts(podcasts) {
      this.podcasts = podcasts;
      this.$refs.categories.style.display = 'none';
    },
    clearPodcasts() {
      this.podcasts = [];
      this.$refs.categories.style.display = 'block';
    }
  }
}
</script>

<style scoped>
#search-view-container {
  padding-right: 10px;
  overflow-y: auto; /* Allows scrolling if content overflows */
  border-radius: 5px;
  margin: 0;
}

#search-bar {
  background-color: #121212;
  left: -7px;
}

#search-bar-container {
  z-index: 1;
  background: #121212;
  position: fixed;
  display: flex;
  align-items: center;
  top: 1.2%;
  width: 78%;
  padding: 14px 0;
  height: 6%;
}

#categories {
  position: relative;
  top: 50px;
  left: -7px;
}
</style>

