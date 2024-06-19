<template>
  <div class="podcastContainer">
    <div class="containerTitle"></div>
    <div class="podcastCards">
      <div class="podcastCard" @click="sendPodcastId">
        <div class="podcastImageContainer">
          <img :src="image" class="podcastImage" v-if="image"/>
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
  </div>
</template>

<script>
export default {
  name: 'PodcastElement',
  props: ['image', 'podcastTitle', 'podcastAuthor', 'podcastId'], 
  methods: {
    sendPodcastId() {
      this.$router.push({ name: 'PodcastView', params: { podcastId: this.podcastId } });
    }
  }
}
</script>

<style>
.containerTitle {
  color: #fdfdfd;
  text-align: start;
  font-weight: bold;
  font-size: 20px;
  padding-left: 12px;
}

.podcastContainer {
  background: #121212;
  width: fit-content;
  padding: 22px;
}

.podcastCards {
  display: flex;
  flex-wrap: wrap;
  background: rgb(18, 18, 18);
  width: fit-content;
  margin: auto;
  border-radius: 8px;
}

.podcastCard {
  border-radius: 8px;
  width: 375px;
  height: 190px;
  margin: 10px;
  background: rgb(24, 24, 24);
  text-align: left;
  padding: 20px;
}

.podcastCard:hover {
  background: rgb(28, 28, 28);
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
  border-radius: 6px;
}

.podcastImageContainer {
  width: 100px;
  height: 100px;
  box-shadow: #121212 0 0 14px;
  border-radius: 6px;
  background: #242424;
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
