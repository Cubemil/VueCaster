<template>
  <div class="container">
    <Background/>
    <h1>{{ title }}</h1>
    <SearchBar @search-performed="updatePodcasts" @clear-search="clearPodcasts"/>
    <PodcastList :podcasts="podcasts"/>
  </div>
</template>

<script>
import Background from './Background.vue'
import SearchBar from './SearchBar.vue'
import PodcastList from './PodcastList.vue';

export default {
  name: 'Homepage',
  components: {Background, SearchBar, PodcastList},
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

</style>