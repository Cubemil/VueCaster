<template>
  <div id="audio-player-container">
    <div id="album-artwork">
      <img :src="albumArtworkUrl" alt="Album Artwork">
    </div>
    <div id="controls">
      <button @click="previousTrack" id="control-button">
        <i id="fas fa-step-backward"></i>
      </button>
      <button @click="togglePlayPause" id="control-button">
        <i :id="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
      </button>
      <button @click="nextTrack" id="control-button">
        <i id="fas fa-step-forward"></i>
      </button>
    </div>
    <div id="progress-bar">
      <span>{{ formatTime(currentTime) }}</span>
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek">
      <span>{{ formatTime(duration) }}</span>
    </div>
    <div id="actions">
      <button @click="toggleLike" id="action-button">
        <i :id="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
      </button>
      <button id="action-button">
        <i id="fas fa-list"></i>
      </button>
    </div>
    <audio ref="audio" :src="audioUrl" @timeupdate="updateTime" @loadedmetadata="loadMetadata"></audio>
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
      albumArtworkUrl: 'https://via.placeholder.com/50', // Placeholder image URL
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isLiked: false
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
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feedUrl)}`);
        const data = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const items = xmlDoc.getElementsByTagName("item");
        if (items.length > 0) {
          const enclosures = items[0].getElementsByTagName("enclosure");
          if (enclosures.length > 0) {
            this.audioUrl = enclosures[0].getAttribute("url");
          }
        }
      } catch (error) {
        console.error('Failed to load podcast:', error);
      }
    },
    togglePlayPause() {
      const audio = this.$refs.audio;
      if (this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    previousTrack() {
      this.currentTime = Math.max(0, this.currentTime - 10); // Skip back 10 seconds
      this.seek();
    },
    nextTrack() {
      this.currentTime = Math.min(this.duration, this.currentTime + 10); // Skip forward 10 seconds
      this.seek();
    },
    seek() {
      this.$refs.audio.currentTime = this.currentTime;
    },
    updateTime() {
      this.currentTime = this.$refs.audio.currentTime;
      this.duration = this.$refs.audio.duration;
    },
    loadMetadata() {
      this.duration = this.$refs.audio.duration;
    },
    toggleLike() {
      this.isLiked = !this.isLiked;
    },
    formatTime(time) {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60).toString().padStart(2, '0');
      return `${minutes}:${seconds}`;
    }
  }
};
</script>

<style scoped>
#audio-player-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1% 4%;
  box-sizing: border-box;
  background-color: #000000;
}

#album-artwork img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
}

#controls {
  display: flex;
  align-items: center;
}

#control-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  margin: 0 10px;
  cursor: pointer;
}

#progress-bar {
  display: flex;
  align-items: center;
  width: 40%;
}

#progress-bar input[type="range"] {
  width: 100%;
  margin: 0 10px;
}

#actions {
  display: flex;
  align-items: center;
}

#action-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  margin: 0 10px;
  cursor: pointer;
}
</style>
