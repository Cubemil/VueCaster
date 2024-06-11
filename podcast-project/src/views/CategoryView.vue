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
    data() {
        return {
            title: 'Category Search',
            podcasts: []
        }
    },
    components: { Categories, PodcastList},
    methods: {
        updatePodcasts(podcasts) {
            this.podcasts = podcasts;
        }
    }
}
</script>

<style scoped>
</style>