<template>
  <div id="queue-controller">
    <div v-if="queue.length > 0" id="visible-queue">
      
      <div id="queue-header">
        <h2>Queue</h2>
        <button class="action-button" @click="removeAllFromQueue" id="remove-all-button" aria-label="Remove">
            <i class="fas fa-trash"></i>
            Remove all
        </button>
      </div>

      <transition-group name="fade" tag="div">
        <draggable :list="queue" @end="updateQueue" class="draggable">
          <div v-for="(episode, index) in queue" :key="episode.id" :class="{ 'queue-item': true, 'playing': episode.id === currentEpisode?.id }">
            <img :src="episode.imgURL" alt="Podcast image" @click="sendPodcastId(episode)">
            
            <div id="episode-details">
              <h3 id="episode-title">{{ episode.title }}</h3>
              <p id="episode-artist" @click="sendPodcastId(episode)">{{ episode.artist }}</p>
              <div id="duration-area">
                <i class="fas fa-clock" id="duration-icon"></i> 
                {{ Math.floor(episode.duration / 60) }} min
              </div>
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
    </div>

    <div v-else id="empty-queue">
      <h2>Queue</h2>
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
      localStorage.setItem('queue', JSON.stringify(this.queue))
    },
    sendPodcastId(episode) {
      const podcastId = episode.podcast_id
      const targetRoute = this.$router.resolve({ name: 'PodcastView', params: { podcastId } })

      if (targetRoute) this.$router.push(targetRoute.href)
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
  width: 35em;
  max-height: 50vh;
  background: #1e1e1e;
  color: #fff;
  overflow-y: auto;
  padding: 0.5em;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  border-radius: 8px;
  overflow-x: hidden;
}

#empty-queue {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

#visible-queue {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#queue-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: 2%;
  margin-right: 2%;
}

.queue-item {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  margin: 1%;
  transition: all 0.3s ease;
  padding: 1em;
}

.queue-item:last-child {
  border-bottom: none;
}

.queue-item:hover {
  scale: 1.01;
  background: #333;
}

.queue-item.playing {
  background: rgba(132, 244, 126, 0.19)
}

.queue-item img {
  width: 100px;
  height: 100px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 5%;
  flex: 20%;
  transition: opacity 0.3s ease;
}

.queue-item img:hover {
  cursor: pointer;
  opacity: 0.5;
}

#episode-details {
  flex: 60%;
}

#episode-title {
  margin: 0 1 1;
}

#episode-artist {
  color: #b3b3b3;
}

#episode-artist:hover {
  cursor: pointer;
  text-decoration: underline;
}

#button-area {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 20%;
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
  transition: color 0.3s ease, transform 0.3s ease;
}

#remove-all-button:hover {
  color: #11ff00;
  transform: scale(1.05);
}

.draggable:hover {
  cursor:grab;
}

.draggable:hover:active {
  cursor: grabbing;
}

@media (max-width: 768px) {
  #queue-controller {
    width: 25em;
    max-height: 40vh;
  }

  .queue-item {
    margin: 0.5%;
    padding: 0.5em;
  }

  .queue-item img {
    width: 80px;
    height: 80px;
  }

  #episode-title {
    margin: 0.5em 1em 0;
  }

  #remove-all-button {
    margin-top: 3%;
  }
}
</style>
