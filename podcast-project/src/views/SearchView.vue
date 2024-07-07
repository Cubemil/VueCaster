<template>
  <div id="podcast-view-container">
    <div id="details-area">
      <PodcastDetails/>
    </div>
    <div id="episodes-area">
      <h2>Episodes</h2>
      <PodcastEpisodeList/>
    </div>
  </div>
</template>

<script setup>
import PodcastDetails from '../components/PodcastDetails.vue';
import PodcastEpisodeList from '../components/PodcastEpisodeList.vue';
</script>

<style scoped>
#podcast-view-container {
  display: flex;
  flex-direction: row;
  padding: 1%;
}

#details-area {
  flex: 50%;
  overflow-y: auto;
}

#episodes-area {
  flex: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow-y: auto;
  padding-left: 1%; /* avoid details touching scrollbar */
}
</style>
