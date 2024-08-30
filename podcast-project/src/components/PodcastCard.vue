<template>
  <div id="podcast-card-container" @click="sendPodcastId();getSearchedPodcasts();" aria-label="View podcast details">

    <div id="top-area">
      <div id="podcast-image-container">
        <img v-if="image" :src="image" id="podcast-image" alt="Podcast Image"/>
        <div v-else class="skeleton-image"></div>
      </div>
      <button
          @click.stop="toggleLike"
          class="action-button"
          :aria-label="liked ? 'Unlike podcast' : 'Like podcast'"
          :class="{ 'active-button' : liked }"
      >
        <i :class="liked ? 'fas fa-heart' : 'far fa-heart'"></i>
      </button>
    </div>

    <div id="podcast-title">
      <div v-if="podcastTitle">{{ podcastTitle }}</div>
      <div v-else class="skeleton-title"></div>
    </div>
    <div id="podcast-author">
      <div v-if="podcastAuthor">{{ podcastAuthor }}</div>
      <div v-else class="skeleton-author"></div>
    </div>

  </div>
</template>

<script>
export default {
  props: {
    image: String,
    podcastTitle: String,
    podcastAuthor: String,
    podcastId: [String, Number],
    isLiked: Boolean
  },
  data() {
    return {
      liked: this.isLiked,
      searchedPodcasts: []  // Array to store clicked podcast IDs
    }
  },
  watch: {
    isLiked(newVal) {
      this.liked = newVal
    }
  },
  created() {
    // Retrieve the clickedPodcastIds array from local storage when the component is created
    this.clickedPodcastIds = JSON.parse(localStorage.getItem('clickedPodcastIds') || '[]');
  },
  methods: {
    sendPodcastId() {
      this.$router.push({name: 'PodcastView', params: {podcastId: this.podcastId}})
    },
    toggleLike() {
      this.liked = !this.liked

      const likedPodcasts = JSON.parse(localStorage.getItem('likedPodcasts') || '[]')
      if (this.liked) {
        likedPodcasts.push(this.podcastId)
      } else {
        const index = likedPodcasts.indexOf(this.podcastId)
        if (index !== -1) likedPodcasts.splice(index, 1)
      }
      localStorage.setItem('likedPodcasts', JSON.stringify(likedPodcasts))

      // dispatch a storage event manually for live updates in other components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'likedPodcasts',
        newValue: JSON.stringify(likedPodcasts),
      }))
    },
    getSearchedPodcasts() {
      this.clickedPodcastIds.push(this.podcastId);  // Add the current podcast ID to the array
      localStorage.setItem('clickedPodcastIds', JSON.stringify(this.clickedPodcastIds));  // Save the array in local storage
      console.log('Clicked Podcasts: ', this.clickedPodcastIds);  // Print the array to the console
      // TODO retrieve data in RecentSearchList component
    }
  }
}
</script>

<style scoped>
#podcast-card-container {
  border-radius: 8px;
  width: 316px;
  height: 190px;
  margin: 0.7em;
  background: rgb(24, 24, 24);
  text-align: left;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
}

#podcast-card-container:hover {
  background: rgb(47, 47, 47);
  scale: 1.05;
}

#top-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

#podcast-image {
  width: 100px;
  height: auto;
  box-shadow: #121212 0 0 14px;
  border-radius: 6px;
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
