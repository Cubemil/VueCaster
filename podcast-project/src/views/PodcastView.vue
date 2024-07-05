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
}
</script>