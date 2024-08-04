<template>
  <div id="podcast-view-container">
    <div id="details-area">
      <PodcastDetails :data="podcastDetails"/>
    </div>
    <div id="episodes-area" v-if="podcastDetails">
      <h2>Episodes</h2>
      <PodcastEpisodeList :episodes="podcastEpisodes" :podcastImage="podcastDetails?.imgURL" @playEpisode="playEpisode" @addToQueue="addToQueue"/>
    </div>
  </div>
</template>

<script setup>
import PodcastDetails from '../components/PodcastDetails.vue';
import PodcastEpisodeList from '../components/PodcastEpisodeList.vue';
</script>

<script>
export default {
  data() {
    return {
      podcastDetails: null,
      podcastEpisodes: []
    };
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
        console.log('Podcast details:', this.podcastDetails)
        console.log('Podcast episodes:', this.podcastEpisodes)
      } catch (err) {
        console.error('Error fetching podcast details:', err)
      }
    },
    playEpisode(episode) {
      const episodeWithArtist = { ...episode, artist: this.podcastDetails.title }
      console.log('Emitting episode with artist:', episodeWithArtist)
      this.$emit('playEpisode', episodeWithArtist)
    },
    addToQueue(episode) {
      const episodeWithArtist = { ...episode, artist: this.podcastDetails.title }
      console.log('Adding episode to queue:', episodeWithArtist)
      this.$emit('addToQueue', episodeWithArtist)
    }
  },
  mounted() {
    this.getPodcastData()
  }
}
</script>

<style scoped>
#podcast-view-container {
  display: flex;
  flex-direction: row;
  padding: 1%;
  font-size: 100%;
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
