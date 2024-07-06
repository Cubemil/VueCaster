<template>
	<div id="podcast-detailed-view-container" v-if="data && data.title">
		<img :src="data.imgURL" alt="Podcast Image" id="podcast-image" />
		<h1>{{ data.title }}</h1>
		<h2>{{ data.author || 'Author Unknown' }}</h2>
		<a :href="data.htmlURL" target="_blank">Link to Podcast: {{ data.htmlURL }}</a>
		<p v-html="data.description"></p>

		<div id="visualization">
			<p>Language: {{ data.language }}</p>
			<p>Average episode length: {{ data.stats.medianduration_string }}</p>
			<p>Episode count: {{ data.episode_count }}</p>
			<p>Last publication: {{ data.lastpub }}</p>
			<p>Publication interval: {{ data.stats.pubinterval_string }}</p>
			<p>Complete duration: {{ data.stats.complete_duration_value }}</p>
		</div>
	</div>
	
	<div v-else>
		Loading podcast details...
	</div>

</template>

<script>
export default {
	name: 'Podcastdetails',
	data() {
		return {
			data: {},
		}
	},
	mounted() {
		this.getPodcastDetails();
	},
	methods: {
		async getPodcastDetails() {
			try {
					const podcastId = this.$route.params.podcastId;
					let url = new URL('https://api.fyyd.de/0.2/podcast/');
					url.searchParams.append('podcast_id', podcastId);
					const response = await fetch(url);
					const body = await response.json();

					this.data = body.data;
					console.log("Podcast details fetched: ", this.data);
			} catch (err) {
					console.error('Error fetching podcast details:', err);
			}
		}
	}
}
</script>

<style scoped>
#podcast-detailed-view-container {
	display: flex;
	flex-direction: column;
	align-items: left;
	padding: 20px;
	width: 100%;
	height: 100%;
	color: white;
	background-color: transparent;
}

#podcast-image {
	width: 200px;
	height: 200px;
	border-radius: 10px;
	object-fit: cover;
	margin-bottom: 20px;
}

h1 {
	font-size: 2em;
	font-weight: bold;
}

h2 {
	font-size: 1.2em;
	font-weight: normal;
	color: #b3b3b3;
}

a {
	text-decoration: none;
	color: palegreen;
	margin-bottom: 20px;
	display: block;
}

p {
	max-width: 800px;
	text-align: left;
	line-height: 1.6;
}

#visualization {
	margin-top: 20px;
	width: 100%;
	max-width: 800px;
	text-align: left;
	padding-top: 20px;
}

#visualization p {
	margin: 10px 0;
	color: #b3b3b3;
}

</style>
