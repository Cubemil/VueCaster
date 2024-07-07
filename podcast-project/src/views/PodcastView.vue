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
  display: flex;
  align-items: center;
  overflow-y: auto; /* scrollbar is always visible */
}

#episodes-area {
  flex: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
  overflow-y: auto; /* scrollbar is always visible */
  padding-left: 10px; /* avoid details touching scrollbar */
}
</style>
