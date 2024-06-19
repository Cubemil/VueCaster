<template>
    <div class="container">
        <h1>{{ title }}</h1>
        <Categories/>
        <PodcastList :podcasts="podcasts" @search-performed="updatePodcasts"/>
    </div>
</template>

<script>
import Categories from '../components/Categories.vue'
import PodcastList from '../components/PodcastList.vue'

export default {
    name: 'CategoryView',
    components: { Categories, PodcastList},
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