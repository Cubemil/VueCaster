<template>
  <div class="container">
    <h1>{{ title }}</h1>
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
.navbar {
  position: fixed;
  top: 0;
  z-index: 100%;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
</style>