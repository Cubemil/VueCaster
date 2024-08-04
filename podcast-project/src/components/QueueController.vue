<template>
  <div id="queue-controller">
    <div id="queue-header">
      <h2>Queue</h2>
      <button v-if="queue.length > 0" class="action-button" @click="removeAllFromQueue" id="remove-all-button" aria-label="Remove">
        <i class="fas fa-trash"></i>
        Remove all
      </button>
      <button @click="closeQueue" class="action-button" aria-label="Close queue">
        <i class="fas fa-close"></i>
      </button>
    </div>

    <draggable :list="queue" @end="updateQueueOrder">
      <transition-group name="fade" tag="div">
        <div v-for="(episode, index) in queue" :key="episode.id" :class="{ 'queue-item': true, 'playing': episode.id === currentEpisode?.id }">
          <div class="queue-item-content">
            <h3 id="episode-title">{{ episode.title }}</h3>
            <p id="episode-artist">{{ episode.artist }}</p>
          </div>
          <button @click="playEpisode(episode)" class="action-button" aria-label="Play episode">
            <i class="fas fa-play"></i>
          </button>
          <button @click="removeFromQueue(index)" class="action-button" aria-label="Remove episode from queue">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next';

export default {
  components: {
    draggable: VueDraggableNext
  },
  props: {
    queue: { type: Array, required: true },
    currentEpisode: { type: Object }
  },
  methods: {
    playEpisode(episode) {
      this.$emit('playEpisode', episode);
    },
    removeFromQueue(index) {
      this.$emit('removeFromQueue', index);
    },
    removeAllFromQueue() {
      this.$emit('removeAllFromQueue');
    },
    closeQueue() {
      this.$emit('closeQueue');
    },
    updateQueue() {
      this.$emit('update:queue', this.queue);
    },
    updateQueueOrder() {
      // Update local storage after reordering
      localStorage.setItem('queue', JSON.stringify(this.queue));
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

#queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#close-button {
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
}

#episode-title {
  margin: 0 1 1;
}

#episode-artist {
  color: #b3b3b3;
}

.action-button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5em;
  margin-left: 10px;
  cursor: pointer;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
