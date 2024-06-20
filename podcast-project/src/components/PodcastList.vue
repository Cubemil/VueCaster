<template>
  <div class="container">

    <div v-if="visiblePodcasts.length > 0" class="podcast-list">

      <PodcastElement
          v-for="(podcast, index) in visiblePodcasts"
          :key="index"
          :podcast="podcast"
          :podcastId="podcast.id"
          :image="podcast.image"
          :podcastTitle="podcast.title"
          :podcastAuthor="podcast.author"/>
    </div>

    <div class="pagination">
      <div v-if="podcasts.length > currentPage * 10 && currentPage > 0" @click="previousPage" class="pagination_button"
           id="previous_button"></div>
      <div v-if="podcasts.length > (currentPage + 1) * 10" @click="nextPage" class="pagination_button"
           id="next_button"></div>
    </div>

  </div>
</template>

<script>
import PodcastElement from './PodcastElement.vue'

export default {
  name: 'PodcastList',
  components: {PodcastElement},
  props: ['podcasts'],
  data() {
    return {
      visiblePodcasts: [],
      currentPage: 0
    }
  },
  watch: {
    podcasts() {
      this.currentPage = 0;
      this.visiblePodcasts = this.podcasts.slice(0, 10);
    }
  },
  methods: {
    nextPage() {
      this.currentPage++;
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 10, (this.currentPage + 1) * 10);
    },
    previousPage() {
      this.currentPage--;
      this.visiblePodcasts = this.podcasts.slice(this.currentPage * 10, (this.currentPage + 1) * 10);
    },
  }
}

</script>

<style scoped>
.container {
  overflow-y: scroll;
  background: #121212;
  margin: auto;
  border-radius: 10px;
}

.podcast-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-top: 50px;
  background: #121212;
}

.pagination {
  position: relative;
  display: flex;
  justify-content: center;
}

.pagination_button {
  background-size: contain; /*note to self: bitte nicht nochmal denken, dass das ein Tippfehler ist (versteckt die Buttons sonst) */
  background-repeat: no-repeat;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
}


#previous_button {
  background-image: url("../assets/previous_arrow.png");
}

#next_button {
  background-image: url("../assets/next_arrow.png");
}

</style>
