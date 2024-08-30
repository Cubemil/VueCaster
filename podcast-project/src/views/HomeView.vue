<template>
  <div id="home-view-container">
    <TopPodcasts/>
  </div>
</template>

<script setup>
import TopPodcasts from '../components/TopPodcasts.vue'
</script>

<style scoped>
#home-view-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;

}
</style>