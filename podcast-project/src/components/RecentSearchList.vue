<template>
  <div id="recent-search-list-container">
    <h2 style="margin: 0;padding-left: 0.5em;padding-bottom: 0.25em;">Recent searches
      <button id="clearButton" @click="clearSearchList"><i class="fa-solid fa-trash-can" style="color: #ffffff;"></i>
      </button>
    </h2>

    <div id="recent-search-list">
      <PodcastCard
        v-for="podcast in searchedPodcasts"
        :key="podcast.id"
        :podcastId="podcast.id"
        :image="podcast.image"
        :podcastTitle="podcast.title"
        :podcastAuthor="podcast.author"
        :isLiked="podcast.isLiked"
      />
    </div>

    <div v-if="errorMessage" id="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import PodcastCard from "@/components/PodcastCard.vue"

export default {
  name: "RecentSearchList",
  components: {PodcastCard},
  data() {
    return {
      searchedPodcasts: [],
      errorMessage: null,
    }
  },
  mounted() {
    const storedPodcasts = JSON.parse(localStorage.getItem('clickedPodcastIds'))
    if (storedPodcasts) {
      this.searchedPodcasts = storedPodcasts
    }
  },
  methods: {
    clearSearchList() {
      this.searchedPodcasts = [];
      localStorage.removeItem('clickedPodcastIds')
      console.log('Search List cleared: ', this.searchedPodcasts)
      window.location.reload()
    }
  }
}
</script>

<style scoped>
#recent-search-list-container {
  background: transparent;
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin-top: 2em;
  margin-bottom: 1em;
  max-width: 100%;
}

#recent-search-list {
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
}

#clearButton {
  background: none;
  border: none;
  color: #fff;
  font-size: 0.8em;
  margin-left: 10px;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
}

#clearButton:hover {
  color: #11ff00;
  transform: scale(1.2);
}

h2 {
  display: inline-flex;
}
</style>