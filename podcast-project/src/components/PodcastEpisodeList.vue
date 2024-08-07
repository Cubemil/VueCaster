<template>
  <div id="episode-list-container">
    <div v-for="episode in episodes" :key="episode.id" class="episode">
      <img :src="podcastImage" alt="Podcast Image" class="episode-image"/>
      <div class="episode-content">
        <h3>{{ episode.title }}</h3>

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
        <button @click="toggleDescription(episode)" id="toggle-description-button" :aria-label="episode.expanded ? 'Show less' : 'Show more'">
          {{ episode.expanded ? 'Show less' : 'Show more' }}
        </button>
      </div>

      <button @click="playEpisode(episode)" class="play-button" aria-label="Play episode">
        <i class="fas fa-play"></i>
      </button>

      <button v-if="!episode.addedToQueue"
        @click="addToQueue(episode)"
        id="queue-button"
        aria-label="Add episode to queue">
        <i class="fas fa-plus"></i>
    </button>
      <button v-if="episode.addedToQueue"
        @click="removeFromQueue(episode)"
        id="queue-button" 
        aria-label="Remove episode from queue">
        <i class="fas fa-minus"></i>
      </button>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    episodes: { type: Array, required: true },
    podcastImage: { type: String, required: true }
  },
  methods: {
    playEpisode(episode) {
      console.log('Selected Episode: ', episode)
      this.$emit('playEpisode', episode)
    },
    addToQueue(episode) {
      console.log('Adding to queue: ', episode)
      episode.addedToQueue = true // Mark episode as added to the queue
      this.$emit('addToQueue', episode)
    },
    removeFromQueue(episode) {
      console.log('Removing from queue: ', episode)

      const queue = JSON.parse(localStorage.getItem('queue'))
      const index = queue.findIndex(item => item.id === episode.id)
      console.log('Index:', index)

      if (index !== -1) {
        queue.splice(index, 1)
        localStorage.setItem('queue', JSON.stringify(queue))
        this.$emit('updateQueue', queue)
        episode.addedToQueue = false // Mark episode as removed from the queue
      } else {
        console.log('Episode not found in queue')
      }
    },
    toggleDescription(episode) {
      episode.expanded = !episode.expanded
    }
  }
}
</script>

<style scoped>
#episode-list-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.episode {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  width: 100%;
  max-width: 35vw;
  box-sizing: border-box;
  cursor: pointer;
}

.episode-image {
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

#duration-icon, #publication-icon {
  color: #1DB954;
}

#publication-area {
  margin-left: 1%;
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

.episode h3 {
  font-size: 1.3em;
  margin: 0;
  overflow: hidden;
}

.episode p {
  font-size: 1em;
  color: #666;
}

.play-button, #queue-button {
  align-self: center;
  background: none;
  border: none;
  color: #1DB954;
  font-size: 1.5em;
  margin-left: 10px;
  cursor: pointer;
}
</style>
