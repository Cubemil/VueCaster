<template>
  <div class="container">
    <div id="searchbar">
      <SearchBar @search-performed="updatePodcasts" @clear-search="clearPodcasts"/>
    </div>
    <PodcastList :podcasts="podcasts"/>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue';
import PodcastList from '../components/PodcastList.vue';

export default {
  name: 'SearchViewOld',
  components: {SearchBar, PodcastList},
  data() {
    return {
      podcasts: []
    }
  },
  methods: {
    updatePodcasts(podcasts) {
      this.podcasts = podcasts;
    },
    clearPodcasts() {
      this.podcasts = [];
    }
  }
}
</script>

<style scoped>
.container {
  position: fixed;
  top: 10px;
  left: 274px;
  width: calc(100% - 284px); /* 274px left margin + 10px right margin */
  height: calc(100% - 20px); /* 10px top + 10px bottom */
  padding-right: 10px;
  box-sizing: border-box; /* Include padding in the width calculation */
  overflow-y: auto; /* Allows scrolling if content overflows */
  border-radius: 10px;
}

#searchbar {
  position: absolute;
  left: 0;
  top: 10px;
  z-index: 1;
}
</style>