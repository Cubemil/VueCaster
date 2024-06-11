<template>
    <div class="container" v-if="data && data.title">
        <h1>{{ data.title }}</h1>
        <h2>{{ data.author || 'Author Unknown' }}</h2>
        <img :src="data.imgURL" alt="Podcast Image" />
        <p v-html="data.description"></p>
        <div class="visualization">
            <p>Episode Count: {{ data.episode_count }}</p>
            <p>Language: {{ data.language }}</p>
        </div>
    </div>
    <div v-else>
        Loading podcast details...
    </div>
</template>

<script>
export default {
    mounted() {
        this.data = this.$route.params.podcastId;
        console.log("PodcastId received: ", this.data);
        this.getPodcastDetails();
    },
    data() {
        return {
            data: {},
        };
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
    max-width: 80%;
    margin: auto;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.container h1, .container h2 {
    color: #333;
}

.container img {
    width: 300px;
    height: auto;
    border-radius: 8px;
    align-self: flex-start;
}

.container p {
    text-align: justify;
    line-height: 1.6;
    color: #333;
}

.visualization {
    margin-top: 20px;
    border-top: 1px solid #ccc;
    padding-top: 20px;
}
</style>
