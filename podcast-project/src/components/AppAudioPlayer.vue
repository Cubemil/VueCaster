<template>
  <div id="audio-player-container">
    <div id="player-left">
      <img :src="currentEpisode?.imgURL || albumArtworkUrl" alt="Album Artwork" id="album-cover">
      <div id="podcast-info">
        <div id="podcast-title">{{ currentEpisode?.title || podcastTitle }}</div>
        <div id="podcast-artist">{{ currentEpisode?.author || podcastArtist }}</div>
      </div>
    </div>
    <div id="player-center">
      <div id="controls">
        <button @click="previousPodcast" id="control-button">
          <i class="fas fa-step-backward"></i>
        </button>
        <button @click="togglePlayPause" id="control-button">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <button @click="nextPodcast" id="control-button">
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
    <audio ref="audio" :src="currentEpisode?.enclosure || audioUrl" @timeupdate="updateTime" @loadedmetadata="loadMetadata"></audio>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  props: {
    episode: { type: Object, default: null }
  },
  data() {
    return {
      currentEpisode: this.episode,
      albumArtworkUrl: 'https://via.placeholder.com/50',
      podcastTitle: 'Podcast Title',
      podcastArtist: 'Podcast Artist',
      audioUrl: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isLiked: false
    }
  },
  watch: {
    episode: {
      handler(newValue) {
        if (newValue) {
          console.log('New episode received:', newValue);
          this.currentEpisode = newValue;
          this.loadEpisode(newValue);
        }
      },
      immediate: true
    }
  },
  methods: {
    loadEpisode(episode) {
      const audio = this.$refs.audio;
      if (audio) {
        console.log('Loading episode:', episode);
        audio.src = episode.enclosure;
        audio.load();
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
      } else {
        console.error('Audio element not found');
      }
    },
    togglePlayPause() {
      const audio = this.$refs.audio;
      if (audio) {
        if (this.isPlaying) {
          console.log('Pausing audio');
          audio.pause();
        } else {
          console.log('Playing audio');
          audio.play();
        }
        this.isPlaying = !this.isPlaying;
      } else {
        console.error('Audio element not found');
      }
    },
    previousPodcast() {
      this.currentTime = Math.max(0, this.currentTime - 10); // Skip back 10 seconds
      this.seek();
    },
    nextPodcast() {
      this.currentTime = Math.min(this.duration, this.currentTime + 10); // Skip forward 10 seconds
      this.seek();
    },
    seek() {
      const audio = this.$refs.audio;
      if (audio) {
        audio.currentTime = this.currentTime;
      } else {
        console.error('Audio element not found');
      }
    },
    updateTime() {
      const audio = this.$refs.audio;
      if (audio) {
        this.currentTime = audio.currentTime;
        this.duration = audio.duration;
      } else {
        console.error('Audio element not found');
      }
    },
    loadMetadata() {
      const audio = this.$refs.audio;
      if (audio) {
        this.duration = audio.duration;
      } else {
        console.error('Audio element not found');
      }
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
