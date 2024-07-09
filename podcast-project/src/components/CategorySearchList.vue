<template>
  <div id="categories-container">
    <div id="categoriesTitle">Categories</div>
    <div id="category-cards-container">
      <div class="cards" style="background: rgb(13, 114, 235)" @click="getPodcastsInCategory('arts')">
        <h2>Arts</h2>
      </div>
      <div class="cards" style="background: rgb(141, 102, 171)" @click="getPodcastsInCategory('food')">
        <h2>Food</h2>
      </div>
      <div class="cards" style="background: rgb(232, 20, 41)" @click="getPodcastsInCategory('science')">
        <h2>Science</h2>
      </div>
      <div class="cards" style="background: rgb(39, 132, 106)" @click="getPodcastsInCategory('technology')">
        <h2>Technology</h2>
      </div>
      <div class="cards" style="background: rgb(224, 51, 0)" @click="getPodcastsInCategory('business')">
        <h2>Business</h2>
      </div>
    </div>
    <div v-if="errorMessage" id="error-message">{{ errorMessage }}</div>
    <i v-if="isLoading" class="fas fa-spinner fa-spin" id="loading-indicator"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: null,
      isLoading: false,
    };
  },
  methods: {
    async getPodcastsInCategory(categoryName) {
      this.errorMessage = null;
      this.isLoading = true;

      try {
        // retrieve categories from local storage
        const categories = JSON.parse(localStorage.getItem('categories'));
        let category = null;

        // find id that matches category name
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].name.toLowerCase() === categoryName.toLowerCase()) {
            category = categories[i];
            break;
          }
        }

        if (!category) throw new Error('Category not found');

        const categoryId = category.id;
        
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
        console.error('Failed to fetch podcasts:', error.message)
        this.errorMessage = error.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
}
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

#loading-indicator {
  color: #fbfbfb;
  font-size: 300%;
  text-align: center;
  margin-top: 10px;
}
</style>
