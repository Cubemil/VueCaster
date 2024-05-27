<template>
  <div>
    <h1>{{ podcast.title }}</h1>
    <img :src="podcast.imgURL" alt="Podcast Image">
    <p>Author: {{ podcast.author }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    id: {
      type: String, // Vue Router 4 passes route params as strings
      required: true
    }
  },
  data() {
    return {
      podcast: {}
    };
  },
  created() {
    this.fetchPodcastDetails();
  },
  methods: {
    async fetchPodcastDetails() {
      try {
        const response = await axios.get(`https://api.fyyd.de/0.2/podcast/${this.id}`);
        this.podcast = response.data;
      } catch (error) {
        console.error('Error fetching podcast details:', error);
      }
    }
  }
};
</script>

<style>
/* Add styles as needed */
</style>
