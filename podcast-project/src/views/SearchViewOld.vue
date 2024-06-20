<template>
  <div class="container">
    <SearchBar @search-performed="updatePodcasts" @clear-search="clearPodcasts"/>
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

<style>
</style>