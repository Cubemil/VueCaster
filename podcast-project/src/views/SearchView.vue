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
  name: 'SearchView',
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
  width: calc(100% - 280px); /* 274px left margin + 10px right margin */
  height: calc(100% - 20px); /* 10px top + 10px bottom */
  padding-right: 10px;
  box-sizing: border-box; /* Include padding in the width calculation */
  overflow-y: auto; /* Allows scrolling if content overflows */
  border-radius: 5px;
}

#searchbar {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background: #121212;
  padding: 10px 0;
  width: calc(100% - 12px);
}

/* width */
::-webkit-scrollbar {
  width: 12px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #5a5959;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #6e6d6d;
}
</style>