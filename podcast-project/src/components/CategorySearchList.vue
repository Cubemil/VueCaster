<template>
  <div id="categories-container">
    <div id="categoriesTitle">Categories</div>
    <div id="category-cards-container">
      <div class="cards" style="background: rgb(13, 114, 235)" @click="getPodcastsInCategory(1)">
        <h2>Arts</h2>
      </div>
      <div class="cards" style="background: rgb(141, 102, 171)" @click="getPodcastsInCategory(4)">
        <h2>Food</h2>
      </div>
      <div class="cards" style="background: rgb(232, 20, 41)" @click="getPodcastsInCategory(5)">
        <h2>Literature</h2>
      </div>
      <div class="cards" style="background: rgb(39, 132, 106)" @click="getPodcastsInCategory(8)">
        <h2>Business</h2>
      </div>
      <div class="cards" style="background: rgb(224, 51, 0)" @click="getPodcastsInCategory(14)">
        <h2>Comedy</h2>
      </div>
    </div>
    <div v-if="errorMessage" id="error-message">{{ errorMessage }}</div>
    <div v-if="isLoading" id="loading-message">Loading...</div>
  </div>
</template>

<script>
export default {
  name: 'CategorySearchList',
  data() {
    return {
      errorMessage: null,
      isLoading: false,
    };
  },
  methods: {
    async getPodcastsInCategory(categoryId) {
      this.errorMessage = null;
      this.isLoading = true;
      try {
        const url = new URL('https://api.fyyd.de/0.2/category');
        url.searchParams.append('category_id', categoryId);

        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Category not found. Status: ${response.status}`);
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }

        const body = await response.json();
        console.log("body", body);

        const podcasts = body.data.podcasts.map(podcast => ({
          id: podcast.id,
          title: podcast.title,
          author: podcast.author,
          image: podcast.layoutImageURL,
          url: podcast.url_fyyd,
        }));

        this.$emit('search-performed', podcasts);
      } catch (error) {
        console.error('Failed to fetch podcasts:', error.message);
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
#categories-container {
  background: transparent;
  width: fit-content;
  margin: auto;
  padding: 22px;
}

#categoriesTitle {
  color: #fbfbfb;
  text-align: start;
  font-weight: bold;
  font-size: 20px;
}

#category-cards-container {
  display: flex;
  flex-wrap: wrap;
  background: rgb(18, 18, 18);
  margin: auto;
  border-radius: 8px;
}

#category-cards-container {
  display: flex;
  flex-wrap: wrap;
  background: rgb(18, 18, 18);
  margin: auto;
  border-radius: 8px;
}

.cards {
  border-radius: 8px;
  width: 150px;
  height: 150px;
  margin-right: 10px;
  margin-top: 10px;
  cursor: pointer;
}

.cards h2 {
  margin-left: 14px;
  margin-right: 14px;
  text-align: left;
  font-size: 20px;
}

#error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

#loading-message {
  color: #fbfbfb;
  text-align: center;
  margin-top: 10px;
}
</style>
