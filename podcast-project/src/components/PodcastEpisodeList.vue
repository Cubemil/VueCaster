<template>
  <div id="episode-list-container">
    <div v-for="episode in episodes" :key="episode.id" class="episode">
      <img :src="podcastImage" alt="Podcast Image" class="episode-image"/>
      <div class="episode-content">
        <h3>{{ episode.title }}</h3>
        <i class="fas fa-clock" id="duration-in-seconds"></i> {{ Math.floor(episode.duration / 60) }} minutes
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
      <button @click="addToQueue(episode)" class="queue-button" aria-label="Add episode to queue">
        <i class="fas fa-plus"></i>
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
      console.log('Selected Episode: ', episode);
      this.$emit('playEpisode', episode);
    },
    addToQueue(episode) {
      console.log('Adding to queue: ', episode);
      this.$emit('addToQueue', episode);
    },
    toggleDescription(episode) {
      episode.expanded = !episode.expanded;
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
  max-width: 800px;
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
}

#episode-description {
  margin-top: 10px;
  max-height: 4.5em;
  overflow: hidden;
}

#episode-description.expanded {
  max-height: none;
  overflow: visible;
}

#toggle-description-button {
  background: none;
  border: none;
  color: lime;
  cursor: pointer;
  padding: 0;
  font-size: 1em;
}

.episode h3 {
  font-size: 1.2em;
  margin: 0;
  overflow: hidden;
}

.episode p {
  font-size: 1em;
  color: #666;
}

.play-button, .queue-button {
  align-self: center;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  margin-left: 10px;
  cursor: pointer;
}
</style>
