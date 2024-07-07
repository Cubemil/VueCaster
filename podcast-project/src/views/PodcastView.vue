<template>
  <div id="podcast-view-container">
    
		<div id="details-area">
      <PodcastDetails :data="podcastDetails" />
    </div>

    <div id="episodes-area">
      <h2>Episodes</h2>
      <PodcastEpisodeList :episodes="podcastEpisodes" :podcastImage="podcastDetails?.imgURL"/>
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
			podcastEpisodes: [],
		}
	},
	methods: {
		async getPodcastData() {
			try {
				const podcastId = this.$route.params.podcastId;
				
				const url = new URL('http://api.fyyd.de/0.2/podcast/episodes');
				url.searchParams.append('podcast_id', podcastId);

				const response = await fetch(url).then(response => response.json());

				this.podcastDetails = response.data;
				this.podcastEpisodes = response.data.episodes;
			} catch (err) {
				console.error('Error fetching podcast details:', err);
			}
		}
	},
	mounted() {
		this.getPodcastData();
	},
}
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
  align-items: flex-start;
	height: 100vh;
  overflow-y: auto;
}

#episodes-area {
  flex: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
	height: 100vh;
  overflow-y: auto;
  padding-left: 10px;
}
</style>
