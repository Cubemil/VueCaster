<template>
    <div class="contain">
        <div v-if="visiblePodcasts.length > 0" class="podcast-list">
            <PodcastElement v-for="(podcast, index) in visiblePodcasts" :key="index" :podcastTitle="podcast.title" :podcastAuthors="podcast.authors" :image="podcast.image"/>
        </div>
        <div class="pagination">
            <div v-if="podcasts.length > currentPage * 10 && currentPage > 0" @click="previousPage" class="pagination_button" id="previous_button"></div>
            <div v-if="podcasts.length > (currentPage + 1) * 10" @click="nextPage" class="pagination_button" id="next_button"></div>
        </div>
    </div>
</template>

<script>
import PodcastElement from './PodcastElement.vue'

export default {
    name: 'PodcastList',
    components: {PodcastElement},
    props: ['podcasts'],
    data() {
        return {
            visiblePodcasts: [],
            currentPage: 0
        }
    },
    watch: {
        podcasts() {
            this.currentPage = 0;
            this.visiblePodcasts = this.podcasts.slice(0, 10);
        }
    },
    methods: {
        nextPage() {
            this.currentPage++;
            this.visiblePodcasts = this.podcasts.slice(this.currentPage * 10, (this.currentPage + 1) * 10);
        },
        previousPage() {
            this.currentPage--;
            this.visiblePodcasts = this.podcasts.slice(this.currentPage * 10, (this.currentPage + 1) * 10);
        }
    }
}
</script>

<style scoped>
.podcast-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.pagination {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
}

.pagination_button {
    background-size: contain;
    background-repeat: no-repeat;
    border: none;
    width: 30px; 
    height: 30px;
    cursor: pointer;
}

#previous_button {
    background-image: url("@/assets/previous_arrow.png");
}

#next_button {
    background-image: url("@/assets/next_arrow.png");
}

</style>
