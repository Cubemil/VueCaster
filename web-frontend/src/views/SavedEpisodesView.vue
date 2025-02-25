<template>
  <div id="episode-list-container">

    <div id="head-area">
      <h1 style="margin-left: 0;margin-top: 0.5em; margin-bottom: 0.5em;padding-left: 0.5em;padding-bottom: 0.25em;">
        Saved
        Episodes</h1>
    </div>

    <div v-for="episode in savedEpisodes" :key="episode.id"
         :class="{ 'episode': true, 'playing': episode.id === currentEpisode?.id }">
      <img :src="episode.imgURL" alt="Podcast Image" id="episode-image"/>
      <div class="episode-content">
        <h3 id="episode-title" @click="playEpisode(episode)" aria-label="Play episode">{{ episode.title }}</h3>

        <div id="duration-and-publication-area">
          <div id="duration-area">
            <i class="fas fa-clock" id="duration-icon"></i>
            {{ Math.floor(episode.duration / 60) }} min
          </div>
          <div id="publication-area">
            <i class="fas fa-calendar" id="publication-icon"></i>
            {{ new Date(episode.pubdate).toLocaleDateString() }}
          </div>
        </div>

        <p id="episode-description" :class="{ expanded: episode.expanded }">
          {{ episode.description }}
        </p>
        <button @click="toggleDescription(episode)" id="toggle-description-button"
                :aria-label="episode.expanded ? 'Show less' : 'Show more'">
          {{ episode.expanded ? 'Show less' : 'Show more' }}
        </button>
      </div>

      <button @click="playEpisode(episode)" class="play-button" aria-label="Play episode">
        <i class="fas fa-play"></i>
      </button>

      <button v-if="!episode.addedToQueue"
              @click="addToQueue(episode)"
              id="queue-button"
              aria-label="Add episode to queue"
      >
        <i class="fas fa-plus-circle"></i>
      </button>

      <button v-if="episode.addedToQueue"
              @click="removeFromQueue(episode)"
              id="queue-button"
              aria-label="Remove episode from queue"
      >
        <i class="fas fa-minus-circle"></i>
      </button>

      <button
          @click="toggleLike(episode)"
          class="like-button"
          :aria-label="isEpisodeLiked(episode) ? 'Remove episode from bookmarks' : 'Add episode to bookmarks'"
          :class="{ 'liked-button': isEpisodeLiked(episode) }"
      >
        <i :class="isEpisodeLiked(episode) ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
      </button>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      savedEpisodes: JSON.parse(localStorage.getItem('savedEpisodes')) || [],
      currentEpisode: JSON.parse(localStorage.getItem('currentEpisode')) || null,
    }
  },
  watch: {
    savedEpisodes: {
      handler(newSavedEpisodes) {
        localStorage.setItem('savedEpisodes', JSON.stringify(newSavedEpisodes))
      },
      deep: true
    },
    currentEpisode(newCurrentEpisode) {
      localStorage.setItem('currentEpisode', JSON.stringify(newCurrentEpisode))
    }
  },
  mounted() {
    window.addEventListener('storage', this.handleStorageChange)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
  },
  methods: {
    playEpisode(episode) {
      this.currentEpisode = episode
      this.$emit('playEpisode', episode)
    },
    toggleDescription(episode) {
      episode.expanded = !episode.expanded
    },
    addToQueue(episode) {
      episode.addedToQueue = true
      this.$emit('addToQueue', episode)
    },
    removeFromQueue(episode) {
      this.$emit('removeFromQueue', episode)
    },
    toggleLike(episode) {
      const episodeIndex = this.savedEpisodes.findIndex(item => item.id === episode.id)

      if (episodeIndex === -1) {
        this.savedEpisodes.push(episode)
      } else {
        this.savedEpisodes.splice(episodeIndex, 1)
      }

      localStorage.setItem('savedEpisodes', JSON.stringify(this.savedEpisodes))

      window.dispatchEvent(new StorageEvent('storage', {
        key: 'savedEpisodes',
        newValue: JSON.stringify(this.savedEpisodes)
      }))
    },
    isEpisodeLiked(episode) {
      return this.savedEpisodes.some(item => item.id === episode.id)
    },
    handleStorageChange(event) {
      if (event.key === 'savedEpisodes') {
        this.savedEpisodes = JSON.parse(event.newValue) || []
      } else if (event.key === 'currentEpisode') {
        this.currentEpisode = JSON.parse(event.newValue) || null
      }
    }
  }
}
</script>

<style scoped>
#episode-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  overflow-y: auto;
}

.episode {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.episode:last-child {
  border-bottom: none;
}

.episode:hover {
  background-color: #1f1f1f;
}

#episode-image {
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
}

.episode-content {
  flex: 1;
  max-width: 100%;
  overflow: hidden;
}

#duration-and-publication-area {
  display: flex;
  color: #fff;
}

#duration-area, #publication-area {
  margin-right: 1%;
  margin-left: 1%;
}

#duration-icon, #publication-icon {
  color: #1DB954;
}

#episode-description {
  margin-top: 10px;
  max-height: 4.5em;
  overflow: hidden;
  text-overflow: ellipsis;
}

#episode-description.expanded {
  max-height: none;
  white-space: normal;
  overflow: visible;
}

#toggle-description-button {
  background: none;
  border: none;
  color: #1DB954;
  cursor: pointer;
  padding: 0;
  font-size: 1em;
}

#toggle-description-button:hover {
  text-decoration: underline;
}

.episode h3 {
  font-size: 1.3em;
  margin: 0;
  overflow: hidden;
  cursor: pointer;
  transition: color 0.3s ease;
}

.episode h3:hover {
  color: #1DB954;
}

.episode p {
  font-size: 1em;
  color: #666;
}

.play-button, #queue-button {
  align-self: center;
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.5em;
  margin-left: 10px;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
}

.play-button:hover, #queue-button:hover {
  color: #11ff00;
  transform: scale(1.3);
}

.like-button {
  background: none;
  border: none;
  color: #beb8b8;
  font-size: 1.2em;
  cursor: pointer;
  align-self: center;
  margin-left: 10px;
  transition: transform 0.2s, color 0.2s;
}

.like-button:hover {
  color: #1DB954;
  transform: scale(1.1);
}

.liked-button {
  color: #1DB954;
}

#head-area {
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  align-items: center;
  width: 100%;
}
</style>
