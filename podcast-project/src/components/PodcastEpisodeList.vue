<template>
  <div id="episode-list-container">
    <div v-for="episode in episodes" :key="episode.id" class="episode">
      <img :src="podcastImage" alt="Podcast Image" class="episode-image" />
      <div class="episode-content">
        <h3>{{ episode.title }}</h3>
        <p>{{ episode.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    episodes: { type: Array, required: true },
    podcastImage: { type: String, required: true }
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
}

.episode h3 {
  font-size: 1.2em;
  margin: 0;
  overflow: hidden;
}

.episode p {
  font-size: 1em;
  color: #666;
  display: -webkit-box;
	line-clamp: 5;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
