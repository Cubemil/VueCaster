<template>
	<div id="category-view-container">
		<h1>{{ title }}</h1>
		<CategorySearchList/>
		<PodcastList :podcasts="podcasts" @search-performed="updatePodcasts"/>
	</div>
</template>

<script setup>
import CategorySearchList from '../components/CategorySearchList.vue';
import PodcastList from '../components/PodcastList.vue'
</script>

<script>
export default {
	data() {
		return {
			title: 'Category Search',
			podcasts: []
		}
	},
	methods: {
		updatePodcasts(podcasts) {
			this.podcasts = podcasts;
		},
		clearPodcasts() {
			this.podcasts = [];
		}
	}
}
</script>

<style scoped>
</style>