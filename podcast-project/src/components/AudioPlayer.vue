<template>
  <div class="container" v-if="audioUrl">
    <audio controls :src="audioUrl" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>
  <div v-else>
    Loading Audio Source...
  </div>
</template>

<script>
export default {
  props: {
    feedUrl: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      audioUrl: null,
    };
  },
  watch: {
    feedUrl: {
      handler(newValue) {
        if (newValue) {
          this.loadPodcast(newValue);
        }
      },
      immediate: true
    }
  },
  methods: {
    async loadPodcast(feedUrl) {
      try {
        console.log('RSS url:', feedUrl);
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`);
        const data = await response.json();
        console.log('RSS:', data);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");
        if (items.length > 0) {
          const enclosures = items[0].getElementsByTagName("enclosure");
          if (enclosures.length > 0) {
            this.audioUrl = enclosures[0].getAttribute("url");
            console.log('Audio URL:', this.audioUrl);
          }
        }
      } catch (error) {
        console.error('Failed to load podcast:', error);
      }
    }
  }
};
</script>

<style>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  text-align: center;
}
</style>
