<template>
  <div id="queue-controller">
    <h2>Queue</h2>
    
    <div v-if="queue.length > 0" id="visible-queue">
      <transition-group name="fade" tag="div">
        <draggable :list="queue" @end="updateQueueOrder" class="draggable">
          <div v-for="(episode, index) in queue" :key="episode.id" :class="{ 'queue-item': true, 'playing': episode.id === currentEpisode?.id }">
            <div class="queue-item-content">
              <h3 id="episode-title">{{ episode.title }}</h3>
              <div id="duration-area">
                <i class="fas fa-clock" id="duration-icon"></i> 
                {{ Math.floor(episode.duration / 60) }} min
              </div>
              <p id="episode-artist">{{ episode.artist }}</p>
            </div>
            <div id="button-area">
              <button @click="playEpisode(episode)" class="action-button" aria-label="Play episode">
                <i :class=" episode.id === currentEpisode?.id ? 'fas fa-pause' : 'fas fa-play'"></i>
              </button>
              <button @click="removeFromQueue(index)" class="action-button" aria-label="Remove episode from queue">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </draggable>
      </transition-group>

      <button class="action-button" @click="removeAllFromQueue" id="remove-all-button" aria-label="Remove">
        <i class="fas fa-trash"></i>
        Remove all
      </button>
    </div>

    <div v-else id="empty-queue">
      <p>Nothing in queue</p>
    </div>

  </div>
</template>

<script>
import { VueDraggableNext } from 'vue-draggable-next'

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
      this.$emit('playEpisode', episode)
    },
    removeFromQueue(index) {
      this.$emit('removeFromQueue', index)
    },
    removeAllFromQueue() {
      this.$emit('removeAllFromQueue')
    },
    updateQueue() {
      this.$emit('update:queue', this.queue)
    },
    updateQueueOrder() {
      this.$emit('update:queue', this.queue)
      localStorage.setItem('queue', JSON.stringify(this.queue))
    }
  }
}
</script>

<style scoped>
#queue-controller {
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  bottom: 15vh;
  right: 2vw;
  width: 30vw;
  max-height: 50vh;
  background: #1e1e1e;
  color: #fff;
  overflow-y: auto;
  padding: 1em;
  box-shadow: 2px 0 500em rgba(0, 0, 0, 1);
  z-index: 1000;
  border-radius: 8px;
  overflow-x: hidden;
}

#visible-queue {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.queue-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #444;
}

.queue-item.playing {
  background: #333;
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
  transition: color 0.3s ease, transform 0.3s ease;
}

.action-button:hover {
  color: #11ff00;
  transform: scale(1.2);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

#remove-all-button {
  cursor: pointer;
  margin-top: 5%;
  transition: color 0.3s ease, transform 0.3s ease;
}

#remove-all-button:hover {
  color: #11ff00;
  transform: scale(1.1);
}

.draggable:hover {
  cursor:grab;
}

.draggable:hover:active {
  cursor: grabbing;
}
</style>
