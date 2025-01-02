<template>
  <div id="categories-container">
    <div id="category-cards-container">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="cards"
        :style="{ background: getCategoryColor(category.name) }"
        @click="getPodcastsInCategory(category.name)"
      >
        <i v-if="loadingCategory === category.name" class="fas fa-spinner fa-spin"></i>
        <h2>{{ category.name }}</h2>
      </div>
    </div>
    <div v-if="errorMessage" id="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { useCategoriesStore } from '@/stores/categories'

export default {
  data() {
    return {
      loadingCategory: null
    }
  },
  computed: {
    categories() {
      const store = useCategoriesStore()
      return store.categories
    },
    errorMessage() {
      const store = useCategoriesStore()
      return store.errorMessage
    }
  },
  mounted() {
    const store = useCategoriesStore()
    store.fetchCategories()
  },
  methods: {
    async getPodcastsInCategory(categoryName) {
      const store = useCategoriesStore()
      try {
        this.loadingCategory = categoryName
        await store.fetchCategories() // categories are loaded before fetching podcasts

        const categoryId = store.getCategoryIdByName(categoryName)
        if (!categoryId) {
          throw new Error(`Category not found by name: ${categoryName}`)
        }

        const url = new URL('https://api.fyyd.de/0.2/category')
        url.searchParams.append('category_id', categoryId)

        const response = await fetch(url)
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Category not found. Status: ${response.status}`)
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
        }

        const body = await response.json()
        const podcasts = body.data.podcasts.map(podcast => ({
          id: podcast.id,
          title: podcast.title,
          author: podcast.author,
          image: podcast.layoutImageURL,
          url: podcast.url_fyyd,
        }))

        this.$emit('search-performed', podcasts)
      } catch (error) {
        console.error('Failed to fetch podcasts:', error.message)
      } finally {
        this.loadingCategory = null
      }
    },
    getCategoryColor(name) {
      switch (name.toLowerCase()) {
        case 'arts': return 'rgb(83, 122, 161)'
        case 'business': return 'rgb(232, 17, 91)'
        case 'comedy': return 'rgb(56, 102, 205)'
        case 'education': return 'rgb(225, 51, 0)'
        case 'fiction': return 'rgb(30, 50, 100)'
        case 'government': return 'rgb(186, 93, 7)'
        case 'history': return 'rgb(0, 100, 80)'
        case 'health & fitness': return 'rgb(39, 133, 106)'
        case 'kids & family': return 'rgb(165, 103, 82)'
        case 'leisure': return 'rgb(30, 50, 100)'
        case 'music': return 'rgb(220, 20, 140)'
        case 'religion & spirituality': return 'rgb(96, 129, 8)'
        case 'science': return 'rgb(13, 115, 236)'
        case 'society & culture': return 'rgb(220, 20, 140)'
        case 'sports': return 'rgb(140, 25, 50)'
        case 'technology': return 'rgb(141, 103, 171)'
        case 'true crime': return 'rgb(225, 51, 0)'
        case 'tv & film': return 'rgb(30, 50, 100)'
        default: return 'rgb(130, 130, 130)'
      }
    }
  }
}
</script>

<style scoped>
#categories-container {
  background: transparent;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
}

#category-cards-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  margin-top: 1em;
}

#category-cards-container::-webkit-scrollbar {
  height: 0.7em;
}

.cards {
  border-radius: 8px;
  width: 12em;
  height: 4em;
  margin: 0.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
}

.cards:hover {
  transform: scale(1.05);
}

.cards h2 {
  text-align: center;
  font-size: 1.5em;
}

.cards i {
  font-size: 2em;
  margin-right: 5%;
}

#error-message {
  color: red;
  text-align: center;
  margin-bottom: -19px;
}
</style>
