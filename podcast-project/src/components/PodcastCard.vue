<template>
  <div id="podcast-container">
    <div id="podcast-card" @click="sendPodcastId" aria-label="View podcast details">
      
      <div id="top-area">
        <div id="podcast-image-container">
          <img :src="image" id="podcast-image" v-if="image" alt="Podcast Image"/>
          <div class="skeleton-image" v-else></div>
        </div>
        <button @click.stop="toggleLike" class="action-button" :aria-label="liked ? 'Unlike podcast' : 'Like podcast'" :class="{ 'active-button' : liked }">
          <i :class="liked ? 'fas fa-heart' : 'far fa-heart'"></i>
        </button>
      </div>
      
      <div id="podcast-title">
        <template v-if="podcastTitle">{{ podcastTitle }}</template>
        <div class="skeleton-title" v-else></div>
      </div>
      <div id="podcast-author">
        <template v-if="podcastAuthor">{{ podcastAuthor }}</template>
        <div class="skeleton-author" v-else></div>
      </div>
      <div id="podcast-category"></div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'PodcastCard',
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
#podcast-card {
  border-radius: 8px;
  width: 325px;
  height: 190px;
  margin: 0.7em;
  background: rgb(24, 24, 24);
  text-align: left;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
}

#podcast-card:hover {
  background: rgb(47, 47, 47);
  scale: 1.05;
}

#top-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.action-button {
  background: none;
  border: none;
  color: #646060;
  font-size: 1.5em;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
}

.action-button:hover {
  color: #fff;
  scale: 1.1;
}

.active-button {
  color: #1DB954;
}

#podcast-image {
  width: 100px;
  height: auto;
  box-shadow: #121212 0 0 14px;
  border-radius: 6px;
}

#podcast-title {
  color: #fdfdfd;
  font-size: 30px;
  font-weight: bold;
  position: relative;
  top: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
}

#podcast-author {
  color: #A7A7A7;
  font-size: 14px;
  position: relative;
  top: 35px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
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
