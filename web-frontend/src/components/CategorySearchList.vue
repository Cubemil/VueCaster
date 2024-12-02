<template>
  <div id="categories-container">
    <div id="category-cards-container">
      <div
          v-for="(category, index) in categories"
          :key="index"
          class="cards"
          :style="{ background: category.color }"
          @click="getPodcastsInCategory(category.name)"
      >
        <i v-if="isLoading && loadingCategory === category.name" class="fas fa-spinner fa-spin"></i>
        <h2 v-html="category.name"></h2>
      </div>
    </div>
    <div v-if="errorMessage" id="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      errorMessage: null,
      isLoading: false,
      loadingCategory: null,
      categories: [
        {
          name: 'Arts',
          color: 'rgb(83, 122, 161)'
        },
        {
          name: 'Business',
          color: 'rgb(232, 17, 91)'
        },
        {
          name: 'Comedy',
          color: 'rgb(56, 102, 205)'
        },
        {
          name: 'Education',
          color: 'rgb(225, 51, 0)'
        },
        {
          name: 'Fiction',
          color: 'rgb(30, 50, 100)'
        },
        {
          name: 'Government',
          color: 'rgb(186, 93, 7)'
        },
        {
          name: 'History',
          color: 'rgb(0, 100, 80)'
        },
        {
          name: 'Health & Fitness',
          color: 'rgb(39, 133, 106)'
        },
        {
          name: 'Kids & Family',
          color: 'rgb(165, 103, 82)'
        },
        {
          name: 'Leisure',
          color: 'rgb(30, 50, 100)'
        },
        {
          name: 'Music',
          color: 'rgb(220, 20, 140)'
        },
        {
          name: 'Religion & Spirituality',
          color: 'rgb(96, 129, 8)'
        },
        {
          name: 'Science',
          color: 'rgb(13, 115, 236)'
        },
        {
          name: 'Society & Culture',
          color: 'rgb(220, 20, 140)'
        },
        {
          name: 'Sports',
          color: 'rgb(140, 25, 50)'
        },
        {
          name: 'Technology',
          color: 'rgb(141, 103, 171)'
        },
        {
          name: 'True Crime',
          color: 'rgb(225, 51, 0)'
        },
        {
          name: 'TV & Film',
          color: 'rgb(30, 50, 100)'
        },
      ]
    }
  },
  methods: {
    async getPodcastsInCategory(categoryName) {
      this.errorMessage = null
      this.isLoading = true
      this.loadingCategory = categoryName

      try {
        // retrieve categories from local storage
        const categories = JSON.parse(localStorage.getItem('categories'))
        let category = null

        // find id that matches category name
        for (let i = 0; i < categories.length; i++) {
          if (categories[i].name.toLowerCase() === categoryName.toLowerCase()) {
            category = categories[i]
            break
          }
        }
        if (!category) throw new Error('Category not found')

        const categoryId = category.id
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
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
        this.loadingCategory = null
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
