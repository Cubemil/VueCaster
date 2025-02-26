import { defineStore } from "pinia"
import { authFetch } from "../utils/authFetch"
import { getApiUrl } from "../api"
import { useUserStore } from "./user"

export const useQueueStore = defineStore("queue", {
  state: () => ({
    queue: [],
    isLoading: false,
    errorMessage: null
  }),
  actions: {
    async fetchQueue() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Skipping fetch for queue.");
        return
      }

      this.isLoading = true
      this.errorMessage = null
      this.queue = []

      try {
        const url = getApiUrl("/user/queue")
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
        this.queue = Array.isArray(result.data) ? result.data : []
      } catch (error) {
        console.error('Failed to fetch queue: ', error)
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    async getQueue() {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Skipping fetch for queue.")
        return []
      }

      if (this.queue.length === 0) {
        await this.fetchQueue() // fetch only if not already loaded
      }
      return this.queue
    },
    async isEpisodeInQueue(episode) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Skipping check for an episode in queue.")
        return false
      }
      
      if (!Array.isArray(this.queue))
        this.queue = []

      if (this.queue.length === 0)
        await this.fetchQueue()

      return this.queue.includes(episode)
    },
    async updateQueue(queue) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Cannot set queue.")
        return
      }

      try {
        const url = getApiUrl("/user/queue")
        const response = await authFetch(url, {
          method: "PUT",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ queue })
        })

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        this.queue = queue // update only when api call is successful
        this.sendStorageEvent()
      } catch (error) {
        console.error('Failed to update queue: ', error)
        this.errorMessage = error.message
      }
    },
    async addLikedPodcast(episode) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Cannot add an episode from queue.")
        return
      }

      if (!this.queue.includes(episode)) {
        const updatedQueue = [...this.queue, episode]
        await this.updateQueue(updatedQueue)
      }
    },
    async removeLikedPodcast(episode) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn) {
        console.warn("User is not logged in. Cannot remove an episode from queue.")
        return
      }

      if (this.queue.includes(episode)) {
        const updatedQueue = this.queue.filter(id => id !== episode)
        await this.updateQueue(updatedQueue)
      }
    },
    reset() {
      this.queue = []
      this.isLoading = false
      this.errorMessage = null
    },
    sendStorageEvent() {
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'queue',
        newValue: JSON.stringify(this.getQueue())
      }))
    }
  }
})