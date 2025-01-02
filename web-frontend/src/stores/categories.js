import { defineStore } from "pinia"

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [],
    isLoading: false,
    errorMessage: null
  }),
  actions: {
    async fetchCategories() {
      this.isLoading = true
      this.errorMessage = null

      try {
        const response = await fetch('https://api.fyyd.de/0.2/categories')
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const result = await response.json()
        this.categories = result.data
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    getCategoryIdByName(categoryName) {
      const category = this.categories.find(
        (category) => category.name.toLowerCase() === categoryName.toLowerCase()
      )
      return category ? category.id : null
    }
  }
})