<template>
  <div id="podcast-view-container">
    <div id="details-area">
      <PodcastDetails :data="podcastDetails"/>
    </div>
    <div id="episodes-area" v-if="podcastDetails">
      <h2>Latest Episodes</h2>
      <PodcastEpisodeList
        :episodes="podcastEpisodes"
        :currentEpisode="currentEpisode"
        @playEpisode="playEpisode"
        @addToQueue="addToQueue"
        @updateQueue="updateQueue"
      />
    </div>
  </div>
</template>

<script setup>
import PodcastDetails from '../components/PodcastDetails.vue'
import PodcastEpisodeList from '../components/PodcastEpisodeList.vue'
</script>

<script>
export default {
  data() {
    return {
      podcastDetails: null,
      podcastEpisodes: [],
      currentEpisode: null
    }
  },
  mounted() {
    this.getPodcastData()
  },
  watch: {
    $route() {
      this.getPodcastData()
    }
  },
  methods: {
    async getPodcastData() {
      try {
        const podcastId = this.$route.params.podcastId
        const url = new URL('https://api.fyyd.de/0.2/podcast/episodes')
        url.searchParams.append('podcast_id', podcastId)

        const response = await fetch(url)
        const body = await response.json()

        this.podcastDetails = body.data
        this.podcastEpisodes = body.data.episodes
      } catch (err) {
        console.error('Error fetching podcast details:', err)
      }
    },
    playEpisode(episode) {
      const episodeWithArtist = { ...episode, artist: this.podcastDetails.title }
      this.currentEpisode = episodeWithArtist
      this.$emit('playEpisode', episodeWithArtist)
    },
    addToQueue(episode) {
      const episodeWithArtist = { ...episode, artist: this.podcastDetails.title }
      this.$emit('addToQueue', episodeWithArtist)
    },
    updateQueue(newQueue) {
      this.$emit('updateQueue', newQueue)
    }
  }
}
</script>

<style scoped>
#podcast-view-container {
  display: flex;
  flex-direction: row;
  padding: 1%;
  font-size: 100%;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#details-area {
  flex: 1 1 50%;
  display: flex;
  align-items: flex-start;
  overflow-x: hidden;
}

#episodes-area {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 2%;
  overflow-x: hidden;
}

@media screen and (max-width: 768px) {
  #podcast-view-container {
    flex-direction: column;
    overflow: auto;
    font-size: 150%;
    max-width: 80vw;
  }

  #details-area, #episodes-area {
    flex: none;
    width: 100%;
    overflow-x: hidden;
  }
}
</style>
