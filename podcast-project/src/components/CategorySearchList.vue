<template>
  <div id="categories-container">
    <div id="category-cards-container">
      <div class="cards" style="background: rgb(83, 122, 161)" @click="getPodcastsInCategory('arts')">
        <h2>Arts</h2>
      </div>
      <div class="cards" style="background: rgb(232, 17, 91)" @click="getPodcastsInCategory('business')">
        <h2>Business</h2>
      </div>
      <div class="cards" style="background: rgb(56, 102, 205)" @click="getPodcastsInCategory('comedy')">
        <h2>Comedy</h2>
      </div>
      <div class="cards" style="background: rgb(225, 51, 0)" @click="getPodcastsInCategory('education')">
        <h2>Education</h2>
      </div>
      <div class="cards" style="background: rgb(30, 50, 100)" @click="getPodcastsInCategory('fiction')">
        <h2>Fiction</h2>
      </div>
      <div class="cards" style="background: rgb(186, 93, 7)" @click="getPodcastsInCategory('government')">
        <h2>Government</h2>
      </div>
      <div class="cards" style="background: rgb(0, 100, 80)" @click="getPodcastsInCategory('history')">
        <h2>History</h2>
      </div>
      <div class="cards" style="background: rgb(39, 133, 106)" @click="getPodcastsInCategory('health & fitness')">
        <h2>Health & <br> Fitness</h2>
      </div>
      <div class="cards" style="background: rgb(165, 103, 82)" @click="getPodcastsInCategory('kids & family')">
        <h2>Kids & <br> Family</h2>
      </div>
      <div class="cards" style="background: rgb(30, 50, 100)" @click="getPodcastsInCategory('leisure')">
        <h2>Leisure</h2>
      </div>
      <div class="cards" style="background: rgb(220, 20, 140)" @click="getPodcastsInCategory('music')">
        <h2>Music</h2>
      </div>
      <div class="cards" style="background: rgb(96, 129, 8)" @click="getPodcastsInCategory('religion & spirituality')">
        <h2>Religion & Spirituality</h2>
      </div>
      <div class="cards" style="background: rgb(13, 115, 236)" @click="getPodcastsInCategory('science')">
        <h2>Science</h2>
      </div>
      <div class="cards" style="background: rgb(220, 20, 140)" @click="getPodcastsInCategory('society & culture')">
        <h2>Society & Culture</h2>
      </div>
      <div class="cards" style="background: rgb(140, 25, 50)" @click="getPodcastsInCategory('sports')">
        <h2>Sports</h2>
      </div>
      <div class="cards" style="background: rgb(141, 103, 171)" @click="getPodcastsInCategory('technology')">
        <h2>Technology</h2>
      </div>
      <div class="cards" style="background: rgb(225, 51, 0)" @click="getPodcastsInCategory('true crime')">
        <h2>True Crime</h2>
      </div>
      <div class="cards" style="background: rgb(30, 50, 100)" @click="getPodcastsInCategory('tv & film')">
        <h2>TV & <br> Film</h2>
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
    }
  },
  methods: {
    async getPodcastsInCategory(categoryName) {
      this.errorMessage = null
      this.isLoading = true

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
        console.log("body", body)
  
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
  margin: 1em auto;
  max-width: 100%;
}

#category-cards-container {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-gutter: stable;
}

#category-cards-container::-webkit-scrollbar {
  height: 0.5em;
  transition: height 0.3s ease;
}

#category-cards-container:hover::-webkit-scrollbar {
  height: 0.7em;
}

#category-cards-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

#category-cards-container:hover::-webkit-scrollbar-thumb {
  background: #a0a0a0;
}

.cards {
  border-radius: 8px;
  width: 10em;
  height: 4em;
  margin: 0.5em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.cards:hover {
  transform: scale(1.05);
}

.cards h2 {
  text-align: center;
  font-size: 1.5em;
}

#error-message {
  color: red;
  text-align: center;
  margin-bottom: -19px;
}

#loading-indicator {
  color: #fbfbfb;
  font-size: 2em;
  text-align: center;
  margin-top: 10px;
  margin-bottom: -42px;
}
</style>
