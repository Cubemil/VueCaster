<template>
  <div class="podcastContainer">
    <div class="podcastCard" @click="sendPodcastId" aria-label="View podcast">
      <div class="image-and-like">
        <div class="podcastImageContainer">
          <img :src="image" class="podcastImage" v-if="image" alt="Podcast Image"/>
          <div class="skeleton-image" v-else></div>
        </div>
        
        <div class="likeButton" @click.stop="toggleLike" :aria-label="liked ? 'Unlike' : 'Like'">
          <img :src="liked ? require('../assets/heartFullWhite.svg') : require('../assets/heartEmptyWhite.svg')" height="35em" class="like_icon"/>
        </div>
      </div>
      
      <div class="podcastTitle">
        <template v-if="podcastTitle">{{ podcastTitle }}</template>
        <div class="skeleton-title" v-else></div>
      </div>

      <div class="podcastAuthor">
        <template v-if="podcastAuthor">{{ podcastAuthor }}</template>
        <div class="skeleton-author" v-else></div>
      </div>
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
      this.$router.push({ name: 'PodcastView', params: { podcastId: this.podcastId } });
    },
    toggleLike() {
      this.liked = !this.liked;
    }
  }
}
</script>

<style scoped>
.podcastCard {
  border-radius: 8px;
  width: 325px;
  height: 190px;
  margin: 0.7em;
  background: rgb(24, 24, 24);
  text-align: left;
  padding: 20px;
  cursor: pointer;
}

.podcastCard:hover {
  background: rgb(28, 28, 28);
}

.image-and-like {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 10%;
}

.podcastImage {
  width: 100px;
  height: auto;
  box-shadow: #121212 0 0 14px;
  border-radius: 6px;
}

.podcastTitle {
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

.podcastAuthor {
  color: #A7A7A7;
  font-size: 14px;
  position: relative;
  top: 35px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 6px;
}

.podcastImageContainer {
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
