<template>
  <div id="recent-search-list-container">
    <h2 style="margin: 0;padding-left: 0.5em;padding-bottom: 0.25em;">Recent searches</h2>

    <div id="podcast-cards-container">

    </div>

    <div v-if="errorMessage" id="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import PodcastCard from "@/components/PodcastCard.vue";

export default {
  name: "RecentSearchList",
  components: {PodcastCard},
  data() {
    return {
      errorMessage: null,
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

#podcast-cards-container {
  display: flex;
  flex-wrap: wrap;
  overflow-x: hidden;
}
</style>