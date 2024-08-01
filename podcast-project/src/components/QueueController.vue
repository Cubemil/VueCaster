<template>
  <div id="queue-controller">
    <div class="queue-header">
      <h2>Queue</h2>
      <button @click="closeQueue" class="close-button" aria-label="Close queue">
        <i class="fas fa-times"></i>
      </button>
    </div>
    <div v-for="(episode, index) in queue" :key="episode.id" class="queue-item">
      <div class="queue-item-content">
        <h3>{{ episode.title }}</h3>
        <p>{{ episode.author }}</p>
      </div>
      <button @click="playEpisode(episode)" class="queue-play-button" aria-label="Play episode">
        <i class="fas fa-play"></i>
      </button>
      <button @click="removeFromQueue(index)" class="queue-remove-button" aria-label="Remove episode from queue">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    queue: { type: Array, required: true }
  },
  methods: {
    playEpisode(episode) {
      this.$emit('playEpisode', episode);
    },
    removeFromQueue(index) {
      this.$emit('removeFromQueue', index);
    },
    closeQueue() {
      this.$emit('closeQueue');
    }
  }
}
</script>

<style scoped>
#queue-controller {
  position: fixed;
  bottom: 100px;
  right: 20px;
  width: 300px;
  max-height: 50%;
  background: #1e1e1e;
  color: #fff;
  overflow-y: auto;
  padding: 10px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border-radius: 8px;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  cursor: pointer;
}

.queue-item {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #444;
  padding: 10px 0;
}

.queue-item-content {
  flex: 1;
}

.queue-play-button, .queue-remove-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  margin-left: 10px;
  cursor: pointer;
}

.queue-remove-button {
  color: #f00;
}
</style>
