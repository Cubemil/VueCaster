<template>
  <div id="podcast-shelf-item-container" @click="sendPodcastId" aria-label="View podcast details">
    
    <div id="podcast-image-container">
      <img v-if="image" :src="image" class="podcast-image" alt="Podcast Image"/>
      <div v-else class="skeleton-image"></div>
    </div>
  
    <div id="information-area">
      <div id="podcast-title">
        <div v-if="podcastTitle">{{ podcastTitle }}</div>
        <div v-else class="skeleton-title"></div>
      </div>
      <div id="podcast-author">
        <div v-if="podcastAuthor">{{ podcastAuthor }}</div>
        <div v-else class="skeleton-author"></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    image: String,
    podcastTitle: String,
    podcastAuthor: String,
    podcastId: [String, Number]
  },
  data() {
    return {
      liked: false
    }
  },
  methods: {
    sendPodcastId() {
      this.$router.push({ name: 'PodcastView', params: { podcastId: this.podcastId } })
    },
    toggleLike() {
      this.liked = !this.liked
    }
  }
}
</script>

<style scoped>
#podcast-shelf-item-container {
  border-radius: 5%;
  width: 170px;
  height: 220px;
  margin: 0.5em;
  background: rgb(24, 24, 24);
  text-align: center;
  padding: 1.1em;
  cursor: pointer;
  transition: all 0.25s ease;
}

#podcast-shelf-item-container:hover {
  background: rgb(47, 47, 47);
  scale: 1.05;
}

.podcast-image {
  width: 160px;
  height: auto;
  box-shadow: #121212 0 0 14px;
  border-radius: 5%;
}

#information-area {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: flex-start;
  overflow: hidden;
}

#podcast-title {
  color: #fdfdfd;
  font-size: 1.8em;
  font-weight: bold;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

#podcast-author {
  color: #A7A7A7;
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
}

.podcast-image-container {
  width: 100px;
  height: 100px;
  box-shadow: #121212 0 0 14px;
  border-radius: 6px;
  background: #242424;
}

.skeleton-image {
  width: 100px;
  height: auto;
  box-shadow: #121212 0 0 14px;
  border-radius: 6px;
  animation: skeleton-loading 1s linear infinite alternate;
}

.skeleton-title {
  height: 30px;
  background: #242424;
  animation: skeleton-loading 1s linear infinite alternate;
  border-radius: 6px;
  top: 20px;
}

.skeleton-author {
  height: 14px;
  background: #242424;
  animation: skeleton-loading 1s linear infinite alternate;
  border-radius: 6px;
  top: 35px;
}

@keyframes skeleton-loading {
  0% {
    background-color: #242424;
  }
  100% {
    background-color: #303030;
  }
}
</style>
