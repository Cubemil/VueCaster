<template>
  <div id="audio-player-container">
    <div id="player-left">
      <img :src="albumArtworkUrl" alt="Album Artwork" id="album-cover">
      <div id="podcast-info">
        <div id="podcast-title">{{ podcastTitle }}</div>
        <div id="podcast-artist">{{ podcastArtist }}</div>
      </div>
    </div>
    <div id="player-center">
      <div id="controls">
        <button @click="previouspodcast" id="control-button">
          <i class="fas fa-step-backward"></i>
        </button>
        <button @click="togglePlayPause" id="control-button">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <button @click="nextpodcast" id="control-button">
          <i class="fas fa-step-forward"></i>
        </button>
      </div>
      <div id="playbar">
        <span>{{ formatTime(currentTime) }}</span>
        <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek">
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
    <div id="player-right">
      <button @click="toggleLike" id="action-button">
        <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
      </button>
      <button id="action-button">
        <i class="fas fa-list"></i>
      </button>
    </div>
    <audio ref="audio" :src="audioUrl" @timeupdate="updateTime" @loadedmetadata="loadMetadata"></audio>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';

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
      podcastTitle: 'podcast Title', // Placeholder podcast title
      podcastArtist: 'podcast Artist', // Placeholder podcast artist
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
    previouspodcast() {
      this.currentTime = Math.max(0, this.currentTime - 10); // Skip back 10 seconds
      this.seek();
    },
    nextpodcast() {
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
}
</script>

<style scoped>
#audio-player-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1% 2%;
  background-color: #000000;
  color: #fff;
}

#player-left {
  display: flex;
  align-items: center;
}

#album-cover {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 10px;
}

#podcast-info {
  display: flex;
  flex-direction: column;
}

#podcast-title {
  font-size: 0.9em;
  font-weight: bold;
}

#podcast-artist {
  font-size: 0.8em;
  color: #b3b3b3;
}

#player-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
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

#playbar {
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 5px;
}

#playbar input[type="range"] {
  width: 100%;
  margin: 0 10px;
}

#player-right {
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
