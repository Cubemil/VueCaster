<template>
    <div class="container" v-if="data && data.title">
        <img :src="data.imgURL" alt="Podcast Image" />
        <h1>{{ data.title }}</h1>
        <h2>{{ data.author || 'Author Unknown' }}</h2>
        <a href="{{ data.htmlURL }}">Link to Podcast: {{ data.htmlURL }}</a>
        <p v-html="data.description"></p>
        <AudioPlayer :feed-url="data.xmlURL"/>
        <div class="visualization">
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
import AudioPlayer from '../components/AudioPlayer.vue';

export default {
    components: { AudioPlayer },
    data() {
        return {
            data: {},
        };
    },
    mounted() {
        this.data = this.$route.params.podcastId;
        console.log("PodcastId received: ", this.data);
        this.getPodcastDetails();
    },
    methods: {
        async getPodcastDetails() {
            try {
                const podcastId = this.data;
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
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 10px;
  left: 274px;
  width: calc(100% - 284px); /* 274px left margin + 10px right margin */
  height: calc(100% - 20px); /* 10px top + 10px bottom */
  padding-right: 10px;
  box-sizing: border-box; /* Include padding in the width calculation */
  overflow-y: auto; /* Allows scrolling if content overflows */
  border-radius: 10px;
}

.container img {
    width: 20em;
    height: auto;
    border-radius: 8px;
    align-self: center;
}

.container p {
    text-align: justify;
    line-height: 1.6;
    color: white;
}

.visualization {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    padding-top: 20px;
}
</style>
