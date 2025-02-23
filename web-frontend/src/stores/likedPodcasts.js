import { defineStore } from "pinia"
import { authFetch } from "../utils/authFetch"
import { getApiUrl } from "../api"
import { useUserStore } from "./user"

export const useLikedPodcastsStore = defineStore("likedPodcasts", {
  state: () => ({
    likedPodcasts: [],
    isLoading: false,
    errorMessage: null
  }),
  actions: {
    async fetchLikedPodcasts() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        constole.console.warn("User is not logged in. Skipping fetch for liked podcasts.");
        return
      }

      this.isLoading = true
      this.errorMessage = null
      this.likedPodcasts = []

      try {
        const url = getApiUrl("/user/liked-podcasts")
        const response = await authFetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const result = await response.json()
        this.likedPodcasts = Array.isArray(result.data) ? result.data : []
      } catch (error) {
        console.error('Failed to fetch liked podcasts: ', error)
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    async getLikedPodcasts() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Skipping fetch for liked podcasts.")
        return []
      }

      if (this.likedPodcasts.length === 0) {
        await this.fetchLikedPodcasts() // fetch only if not already loaded
      }
      return this.likedPodcasts
    },
    async isPodcastLiked(podcastId) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Skipping check for a liked podcast.")
        return false
      }
      
      if (!Array.isArray(this.likedPodcasts))
        this.likedPodcasts = []

      if (this.likedPodcasts.length === 0)
        await this.fetchLikedPodcasts()

      return this.likedPodcasts.includes(podcastId)
    },
    async setLikedPodcasts(likedPodcasts) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Cannot set liked podcasts.")
        return
      }

      try {
        const url = getApiUrl("/user/liked-podcasts")
        const response = await authFetch(url, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ likedPodcasts })
        })

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        this.likedPodcasts = likedPodcasts // update only when api call is successful
      } catch (error) {
        console.error('Failed to update liked podcasts: ', error)
        this.errorMessage = error.message
      }
    },
    async addLikedPodcast(podcastId) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Cannot add a liked podcast.")
        return
      }

      if (!this.likedPodcasts.includes(podcastId)) {
        const updatedLikedPodcasts = [...this.likedPodcasts, podcastId]
        await this.setLikedPodcasts(updatedLikedPodcasts)
      }
    },
    async removeLikedPodcast(podcastId) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Cannot remove a liked podcast.")
        return
      }

      if (this.likedPodcasts.includes(podcastId)) {
        const updatedLikedPodcasts = this.likedPodcasts.filter(id => id !== podcastId)
        await this.setLikedPodcasts(updatedLikedPodcasts)
      }
    },
    reset() {
      this.likedPodcasts = []
      this.isLoading = false
      this.errorMessage = null
    }
  }
})