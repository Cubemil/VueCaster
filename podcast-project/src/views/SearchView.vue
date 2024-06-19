<template>
  <div class="container">
    <SearchBar @search-performed="updatePodcasts" @clear-search="clearPodcasts"/>
    <PodcastList :podcasts="podcasts"/>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import PodcastList from '../components/PodcastList.vue';

export default {
  name: 'SearchView',
  components: {SearchBar, PodcastList},
  data() {
    return {
      title: 'VueCaster Pro',
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

<style>
.container {
  background: #121212;
  border-radius: 10px;
}
</style>