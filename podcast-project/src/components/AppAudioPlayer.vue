<template>
  <div id="audio-player-container">
    <div id="player-left">
      <img 
        v-if="currentEpisode"
        :src="currentEpisode?.imgURL"
        alt="Album Artwork"
        id="album-cover"
        @click="sendPodcastId"
        aria-label="View podcast details"
      >
      <div id="podcast-info">
        <div id="podcast-title" @click="sendPodcastId" aria-label="View podcast details">
          {{ currentEpisode?.title }}
        </div>
        <div id="podcast-artist" @click="sendPodcastId" aria-label="View podcast details">
          {{ currentEpisode?.artist }}
        </div>
      </div>
    </div>
    <div id="player-center">
      <div id="controls">
        <button
          @click="playPreviousEpisode"
          :disabled="!currentEpisode"
          aria-label="Play Previous Episode"
          class="control-button"
        >
          <i class="fas fa-step-backward"></i>
        </button>
        <button 
          @click="scrollBackwards" 
          :disabled="!currentEpisode" 
          aria-label="Rewind 30 seconds"
          class="control-button"
        >
          <i class="fas fa-backward"></i>
        </button>
        <button 
          @click="togglePlayPause" 
          :disabled="!currentEpisode" 
          :aria-label="isPlaying ? 'Pause' : 'Resume'"
          class="control-button"
        >
          <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'" class="fixed-icon-size"></i>
        </button>
        <button 
          @click="scrollForwards" 
          :disabled="!currentEpisode" 
          aria-label="Forward 30 seconds"
          class="control-button"
        >
          <i class="fas fa-forward"></i>
        </button>
        <button 
          @click="playNextEpisode" 
          :disabled="!currentEpisode" 
          aria-label="Play Next Episode" class="control-button"
        >
          <i class="fas fa-step-forward"></i>
        </button>
      </div>
      <div class="playbar" :class="{ 'disabled-playbar': !currentEpisode }">
        <span>{{ formatTime(currentTime) }}</span>
        <input 
          type="range" 
          min="0"
          :max="duration"
          v-model="currentTime"
          @input="seek"
          aria-label="Seek"
          :aria-valuemin="0"
          :aria-valuemax="duration"
          :aria-valuenow="currentTime"
          :disabled="!currentEpisode"
        >
        <span>{{ formatTime(duration) }}</span>
      </div>
    </div>
    <div id="player-right">
      <button 
        v-if="currentEpisode" 
        @click="toggleLike" 
        class="action-button"
        :aria-label="isLiked ? 'Unlike podcast' : 'Like podcast'" 
        :class="{ 'active-button' : isLiked }"
      >
        <i :class="isLiked ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
      </button>
      <button 
        @click="toggleQueue" 
        class="action-button" 
        id="toggle-queue-button"
        :aria-label="queueVisible ? 'Hide queue' : 'Show queue'" 
        :class="{ 'active-button': queueVisible }"
      >
        <i class="fas fa-list"></i>
      </button>
      <div id="volume-bar">
        <button class="action-button" @click="toggleMute">
          <i class="fas fa-volume-high" ref="icon"></i>
        </button>
        <input 
          type="range"
          ref="volume"
          @input="setVolume"
          @change="setVolume"
          min="0"
          max="1"
          step="0.01"
        />
      </div>
    </div>
    <audio 
      ref="audio" 
      :src="currentEpisode?.enclosure || '' " 
      @timeupdate="updateTime"
      loadedmetadata="loadMetadata"
    >
    </audio>
  </div>
</template>

<script setup>
import '@fortawesome/fontawesome-free/css/all.css'
</script>

<script>
export default {
  props: {
    episode: {type: Object, default: null},
    podcastId: [String, Number]
  },
  data() {
    return {
      currentEpisode: this.episode,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isLiked: false,
      queueVisible: false,
      previousVolume: 1,
      isMuted: false
    }
  },
  watch: {
    episode: {
      handler(newValue) {
        if (newValue) {
          this.currentEpisode = newValue
          this.loadEpisode(newValue)
          this.checkIfLiked()
        }
      },
      immediate: true
    }
  },
  mounted() {
    const savedVolume = localStorage.getItem('rangeValue') || 1
    this.$refs.volume.value = savedVolume
    this.$refs.audio.volume = savedVolume
    this.setVolume()
    
    if (this.currentEpisode) {
      this.checkIfLiked()
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
      if (audio && audio.src) {
        audio.play()
          .then(() => {
            this.isPlaying = true
          })
          .catch((error) => {
            console.error('Failed to play audio:', error)
          })
      } else {
        console.error('Audio element not found')
      }
    },
    togglePlayPause() {
      const audio = this.$refs.audio
      if (audio && audio.src) {
        if (this.isPlaying) {
          audio.pause()
        } else {
          audio.play()
            .then(() => {
              this.isPlaying = true
            })
            .catch((error) => {
              console.error('Failed to play audio:', error)
            })
        }
        this.isPlaying = !this.isPlaying
      } else {
        console.error('Audio element not found')
      }
    },
    playPreviousEpisode() {
      this.$emit('playPreviousEpisode')
    },
    playNextEpisode() {
      this.$emit('playNextEpisode')
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
        if (this.currentTime >= this.duration) {
          this.playNextEpisode() // auto-play next episode
        }
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
      const savedEpisodes = JSON.parse(localStorage.getItem('savedEpisodes') || '[]')
      const episodeIndex = savedEpisodes.findIndex(episode => episode.id === this.currentEpisode.id)

      if (episodeIndex === -1) {
        savedEpisodes.push(this.currentEpisode)
        this.isLiked = true
      } else {
        savedEpisodes.splice(episodeIndex, 1)
        this.isLiked = false
      }

      localStorage.setItem('savedEpisodes', JSON.stringify(savedEpisodes))
    },
    checkIfLiked() {
      if (this.currentEpisode && this.currentEpisode.id) {
        const savedEpisodes = JSON.parse(localStorage.getItem('savedEpisodes') || '[]')
        this.isLiked = savedEpisodes.some(episode => episode.id === this.currentEpisode.id)
      } else {
        this.isLiked = false
      }
    },
    toggleQueue() {
      this.queueVisible = !this.queueVisible
      this.$emit('toggleQueue')
    },
    formatTime(time) {
      if (isNaN(time)) return '00:00'

      const hours = Math.floor(time / 3600)
      const minutes = Math.floor((time % 3600) / 60)
      const seconds = Math.floor(time % 60).toString().padStart(2, '0')
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`
      }
      return `${minutes}:${seconds}`
    },
    sendPodcastId() {
      const podcastId = this.currentEpisode?.podcast_id
      this.$router.push({
        name: 'PodcastView', 
        params: {podcastId: podcastId}
      })
    },
    setVolume() {
      const volumeInput = this.$refs.volume.valueAsNumber
      const audioElement = this.$refs.audio
      const iconElement = this.$refs.icon

      audioElement.volume = volumeInput
      localStorage.setItem('rangeValue', volumeInput)
      this.isMuted = false

      if (volumeInput === 0) {
        iconElement.className = "fas fa-volume-mute"
      } else if (volumeInput <= 0.5) {
        iconElement.className = "fas fa-volume-down"
      } else {
        iconElement.className = "fas fa-volume-up"
      }

      /* TODO check if fa-volume is available someday for medium volume (0.3 - 0.6):
      * } else if (volumeInput <= 0.6) {
      * iconElement.className = "fas fa-volume" */
    },
    toggleMute () {
      const audioElement = this.$refs.audio
      const iconElement = this.$refs.icon

      if (this.isMuted) {
        audioElement.volume = this.previousVolume
        this.$refs.volume.value = this.previousVolume
        this.isMuted = false
        this.setVolume()
      } else {
        this.previousVolume = audioElement.volume
        audioElement.volume = 0
        this.$refs.volume.value = 0
        this.isMuted = true
        iconElement.className = "fas fa-volume-mute"
      }
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
  background-color: black;
  padding: 0.5em;
  color: #fff;
  font-size: 1.7em;
  height: 10vh;
}

#player-left, #player-center, #player-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: flex 0.2s ease;
}

#player-left {
  flex: 1 1 15%;
  overflow: hidden;
  max-height: 100%;
  padding-right: 5%;
}

#album-cover {
  width: 4em;
  height: 4em;
  border-radius: 4px;
  margin-right: 0.5em;
  cursor: pointer;
  transition: opacity 0.2s;
}

#album-cover:hover {
  opacity: 0.5;
}

#podcast-info {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  width: 100%;
}

#podcast-title {
  font-size: 0.9em;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  animation: marquee 10s linear infinite;
  max-width: 100%;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  10% {
    transform: translateX(0);
  }
  90% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

#podcast-artist {
  font-size: 0.7em;
  color: #b3b3b3;
}

#player-center {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  flex: 1 1 30%;
}

#controls {
  display: flex;
  align-items: center;
  font-size: 1em;
}

.control-button {
  color: #beb8b8;
  cursor: pointer;
}

.control-button:hover {
  color: #fff;
}

.playbar {
  display: flex;
  align-items: center;
  width: 100%;
  color: #fff;
  font-size: 0.8em;
}

.playbar input[type="range"] {
  margin: 0 0.5em;
  width: 100%;
}

#volume-bar {
  display: flex;
  align-items: center;
}

#volume-bar input[type="range"] {
  margin: 0 0.5em;
}

.disabled-playbar {
  opacity: 0.5;
}

#player-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1 20%;
}

button:disabled {
  color: #666;
}

.control-button, .action-button {
  background: none;
  border: none;
  color: #beb8b8;
  font-size: 1.2em;
  margin: 0 0.5em;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
}

.control-button:hover, .action-button:hover {
  color: #fff;
  transform: scale(1.1);
}

.control-button:disabled, .action-button:disabled {
  color: #666;
  transform: scale(1);
}

.fixed-icon-size {
  font-size: 1.2em;
  width: 1.5em;
  text-align: center;
  line-height: 1.2em;
}

.action-button {
  background: none;
  border: none;
  color: #beb8b8;
  font-size: 1.3em;
  margin: 0 0.5em;
  cursor: pointer;
  transition: transform 0.2s, color 0.2s;
  width: 2.5em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active-button {
  color: #1DB954;
}

#podcast-title:hover, #podcast-artist:hover {
  text-decoration: underline;
}

@media screen and (max-width: 1024px) {
  #player-left {
    padding-right: 0%;
  }
}

@media screen and (max-width: 768px) {
  #player-left {
    flex: 1 1 10%;  /* shrink left section further on smaller screens */
  }

  #player-center {
    flex: 1 1 80%;
  }
}
</style>