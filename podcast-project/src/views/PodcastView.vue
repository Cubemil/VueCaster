<template>
	<div id="podcast-view-container">
		<div id="podcast-details">
			<PodcastDetails/>
		</div>
		<div id="podcast-episodes">
			<PodcastEpisodeList/>
		</div>
	</div>
</template>

<script>
import PodcastDetails from '../components/PodcastDetails.vue';
import PodcastEpisodeList from '../components/PodcastEpisodeList.vue';

export default {
	name: 'PodcastView',
	components: {PodcastDetails, PodcastEpisodeList},
	
}
</script>

<style scoped>
#podcast-view-container {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20px;
	width: 100%;
	height: 100%;
	color: white;
}

#podcast-details {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

#podcast-episodes {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

</style>