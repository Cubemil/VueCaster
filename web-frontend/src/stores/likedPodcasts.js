import { defineStore } from "pinia"
import { authFetch } from "../utils/authFetch"
import { getApiUrl } from "../api"

export const useLikedPodcastsStore = defineStore("likedPodcasts", {
  state: () => ({
    likedPodcasts: [],
    isLoading: false,
    errorMessage: null
  }),
  actions: {
    async fetchLikedPodcasts() {
      this.isLoading = true
      this.errorMessage = null

      try {
        const url = getApiUrl("user/liked-podcasts")
        
        const response = await authFetch(url)
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const result = await response.json()
        this.likedPodcasts = result.data
      } catch (error) {
        console.error('Failed to fetch liked podcasts: ', error)
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    getLikedPodcasts() {
      return this.likedPodcasts || '[]'
    }
  }
})