<template>
<div id="episode-list-container">
	<div v-for="episode in episodes" :key="episode.id" class="episode">
		<h3>{{ episode.title }}</h3>
		<p>{{ episode.description }}</p>
	</div>
</div>
</template>

<script>
export default {
	props: { episodes: { type: Array, required: true, }}
}
</script>

<style scoped>
#episode-list-container {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.episode {
	border-bottom: 1px solid #ccc;
	padding: 10px;
	width: 100%;
	max-width: 800px;
}

.episode h3 {
	font-size: 1.2em;
	margin: 0;
}

.episode p {
	font-size: 1em;
	color: #666;
}
</style>
