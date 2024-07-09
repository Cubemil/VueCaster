<template>
  <div id="podcast-list-container">
    <div v-if="visiblePodcasts.length > 0" id="podcast-list">
      <PodcastCard
        v-for="(podcast, index) in visiblePodcasts"
        :key="index"
        :podcast="podcast"
        :podcastId="podcast.id"
        :image="podcast.image"
        :podcastTitle="podcast.title"
        :podcastAuthor="podcast.author"/>
    </div>
    <div v-else id="no-podcasts-message">No podcasts found</div>

    <div class="pagination">
      <div v-if="currentPage > 0" @click="previousPage" class="pagination-button" id="previous-button"></div>
      <div v-if="podcasts.length > (currentPage + 1) * 15" @click="nextPage" class="pagination-button" id="next-button"></div>
    </div>
  </div>
</template>

<script setup>
import PodcastCard from './PodcastCard.vue'
</script>

<script>
export default {
  props: { podcasts:  { type: Array, required: true }},
  data() { return     { visiblePodcasts: [], currentPage: 0}},
  watch: {
    podcasts() {
      this.currentPage = 0;
      this.updateVisiblePodcasts();
    }
  },
  mounted() {
    this.updateVisiblePodcasts();
  },
  methods: {
    updateVisiblePodcasts() {
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 15, (this.currentPage + 1) * 15);
    },
    nextPage() {
      this.currentPage++;
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 15, (this.currentPage + 1) * 15);
    },
    previousPage() {
      this.currentPage--;
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 15, (this.currentPage + 1) * 15);
    },
  }
}
</script>

<style scoped>
#podcast-list-container {
  width: 100%;
  overflow-y: auto;
  background: transparent;
  margin: auto;
  border-radius: 10px;
}

#podcast-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-top: 50px;
  background: transparent;
}

.pagination {
  position: relative;
  display: flex;
  justify-content: center;
}

.pagination-button {
  background-size: contain;
  background-repeat: no-repeat;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

#previous-button {
  background-image: url("../assets/previous_arrow.png");
}

#next-button {
  background-image: url("../assets/next_arrow.png");
}

#no-podcasts-message {
  color: #242424;
  font-size: 300%;
  text-align: center;
}

</style>
