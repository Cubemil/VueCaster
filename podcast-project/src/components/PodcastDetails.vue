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

  <div v-else id="loading-area">
    <i class="fas fa-spinner fa-spin" id="loading-indicator"></i>
    Loading podcast details
  </div>
</template>

<script>
export default {
  props: {
    data: {}
  },
  mounted() {
    console.log('PodcastDetails mounted with data:', this.data);
  }
}
</script>

<style scoped>
#podcast-detailed-view-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2%;
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
  color: #1DB954;
  margin-bottom: 20px;
  display: block;
}

p {
  text-align: left;
  line-height: 1.6;
}

#visualization {
  margin-top: 20px;
  width: 100%;
  text-align: left;
  padding-top: 20px;
}

#visualization p {
  color: #b3b3b3;
}

#loading-area {
  font-size: 300%;
}
</style>
