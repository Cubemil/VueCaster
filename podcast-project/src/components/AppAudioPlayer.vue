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
        <button @click="previousPodcast" aria-label="Previous Podcast" class="control-button">
          <i class="fas fa-step-backward"></i>
        </button>
        <button @click="scrollBackwards" aria-label="Rewind 30 seconds" class="control-button">
          <i class="fas fa-backward"></i>
        </button>
        <button @click="togglePlayPause" :aria-label="isPlaying ? 'Pause' : 'Resume'" class="control-button">
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
        </button>
        <button @click="scrollForwards" aria-label="Forward 30 seconds" class="control-button">
          <i class="fas fa-forward"></i>
        </button>
        <button @click="nextPodcast" aria-label="Next Podcast" class="control-button">
          <i class="fas fa-step-forward"></i>
        </button>
      </div>
      <div id="playbar">
        <span>{{ formatTime(currentTime) }}</span>
        <input type="range" min="0" :max="duration" v-model="currentTime" 
       @input="seek" aria-label="Seek" :aria-valuemin="0" :aria-valuemax="duration" :aria-valuenow="currentTime">
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
    <div id="player-right">
      <button @click="toggleLike" id="action-button" :aria-label="isLiked ? 'Like' : 'Unlike'">
        <i :class="isLiked ? 'fas fa-heart' : 'far fa-heart'"></i>
      </button>
      <button @click="$emit('toggleQueue')" id="action-button" aria-label="Open Queue">
        <i class="fas fa-list"></i>
      </button>
    </div>
    <audio ref="audio" :src="currentEpisode?.enclosure || audioUrl" @timeupdate="updateTime" @loadedmetadata="loadMetadata"></audio>
  </div>
</template>

<script setup>
import '@fortawesome/fontawesome-free/css/all.css'
</script>

<script>
export default {
  props: {
    episode: { type: Object, default: null }
  },
  data() {
    return {
      currentEpisode: this.episode,
      albumArtworkUrl: 'https://placehold.co/200/121212/121212',
      podcastTitle: '',
      podcastArtist: '',
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
          console.log('New episode received:', newValue)
          this.currentEpisode = newValue
          this.loadEpisode(newValue)
        }
      },
      immediate: true
    }
  },
  methods: {
    loadEpisode(episode) {
      const audio = this.$refs.audio
      if (audio) {
        console.log('Loading episode:', episode)
        audio.src = episode.enclosure
        audio.load()
        audio.onloadedmetadata = () => {
          this.isPlaying = false
          this.currentTime = 0
          this.duration = audio.duration
          this.playAudio()
        }
      } else {
        console.error('Audio element not found')
      }
    },
    playAudio() {
      const audio = this.$refs.audio
      if (audio) {
        console.log('Playing audio')
        audio.play()
        this.isPlaying = true
      } else {
        console.error('Audio element not found')
      }
    },
    togglePlayPause() {
      const audio = this.$refs.audio
      if (audio) {
        if (this.isPlaying) {
          console.log('Pausing audio')
          audio.pause()
        } else {
          console.log('Playing audio')
          audio.play()
        }
        this.isPlaying = !this.isPlaying
      } else {
        console.error('Audio element not found')
      }
    },
    previousPodcast() {
      console.log('Playing previous podcast')
    },
    nextPodcast() {
      console.log('Playing next podcast')
    },
    scrollBackwards() {
      this.currentTime = Math.max(0, this.currentTime - 30)
      this.seek()
    },
    scrollForwards() {
      this.currentTime = Math.min(this.duration, this.currentTime + 30)
      this.seek()
    },
    seek() {
      const audio = this.$refs.audio
      if (audio) {
        audio.currentTime = this.currentTime
      } else {
        console.error('Audio element not found')
      }
    },
    updateTime() {
      const audio = this.$refs.audio
      if (audio) {
        this.currentTime = audio.currentTime
        this.duration = audio.duration
      } else {
        console.error('Audio element not found')
      }
    },
    loadMetadata() {
      const audio = this.$refs.audio
      if (audio) {
        this.duration = audio.duration
      } else {
        console.error('Audio element not found')
      }
    },
    toggleLike() {
      this.isLiked = !this.isLiked
    },
    formatTime(time) {
      const hours = Math.floor(time / 3600)
      const minutes = Math.floor((time % 3600) / 60)
      const seconds = Math.floor(time % 60).toString().padStart(2, '0')
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`
      }
      return `${minutes}:${seconds}`
    }
  }
}
</script>

<style scoped>
#audio-player-container {
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 1em;
  background-color: black;
  color: #fff;
  font-size: 1.7em;
}

#player-left, #player-center, #player-right {
  flex: 1;
}

#player-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex: 1 1 20%;
  overflow: hidden;
}

#album-cover {
  width: 4em;
  border-radius: 4px;
  margin-right: 0.5em;
}

#podcast-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

#podcast-title {
  font-size: 1em;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  animation: marquee 10s linear infinite;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  10% { transform: translateX(0); }
  90% { transform: translateX(-100%); }
  100% { transform: translateX(-100%); }
}

#podcast-artist {
  font-size: 0.8em;
  color: #b3b3b3;
}

#player-center {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  flex: 1 1 60%;
}

#controls {
  display: flex;
  align-items: center;
}

.control-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2em;
  margin: 0 0.5em;
  cursor: pointer;
}

#playbar {
  display: flex;
  align-items: center;
  width: 80%;
}

#playbar input[type="range"] {
  width: 100%;
  margin: 0 0.5em;
}

#player-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1 20%;
}

#action-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2em;
  margin: 0 0.5em;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  #audio-player-container {
    font-size: 1em;
  }

  #album-cover {
    width: 3em;
    height: 3em;
  }
}
</style>