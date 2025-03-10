import { defineStore } from "pinia"
import { authFetch } from "../utils/authFetch"
import { getApiUrl } from "../api"
import { useUserStore } from "./user"

export const useQueueStore = defineStore("queue", {
  state: () => ({
    queue: [],
    currentEpisode: null,
    isLoading: false,
    errorMessage: null
  }),
  actions: {
    /**
     * Initialize (or refresh) the queue.
     * If user is logged in, fetch from server. Otherwise, fallback to localStorage.
     */
    async initQueue() {
      const userStore = useUserStore()
      this.isLoading = true
      this.errorMessage = null
      try {
        if (userStore.isLoggedIn) {
          const url = getApiUrl("/user/queue")
          const response = await authFetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        if (!response.ok)
          throw new Error(`HTTP error: ${response.status}`)

        const result = await response.json()
        this.queue = Array.isArray(result.data) ? result.data : []
        } else {
          const localQueue = localStorage.getItem('queue')
          this.queue = localQueue ? JSON.parse(localQueue) : []
        }
      } catch (error) {
        console.error('Failed to fetch queue: ', error)
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    },
    
    /**
     * Update the entire queue array. 
     * If logged in, store on server. Otherwise, store in localStorage.
     */
    async updateQueue(newQueue) {
      const userStore = useUserStore()
      try {
        if (userStore.isLoggedIn) {
          const url = getApiUrl("/user/queue")  
          const response = await authFetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ queue: newQueue })
          })

          if (!response.ok)
            throw new Error(`HTTP error: ${response.status}`)
        } else {
          localStorage.setItem('queue', JSON.stringify(newQueue))
        }

        this.queue = newQueue
        this.sendStorageEvent()
      } catch (error) {
        console.error('Failed to update queue: ', error)
        this.errorMessage = error.message
      }
    },

    /**
     * Add an episode to the queue
     */
    async addEpisode(episode) {
      const newQueue = [...this.queue, episode]
      await this.updateQueue(newQueue)
    },

    /**
     * Remove an episode from the queue
     */
    async removeEpisode(index) {
      const newQueue = [...this.queue]
      newQueue.splice(index, 1)
      await this.updateQueue(newQueue)
    },

    /**
     * Remove all episodes
     */
    async removeAllEpisodes() {
      await this.updateQueue([])
    },

    /**
     * Reorder the queue (e.g., after dragging)
     */
    async reorderQueue(newQueue) {
      await this.updateQueue(newQueue)
    },

    /**
     * Check if an episode is in queue
     */
    async isEpisodeInQueue(episode) {
      const userStore = useUserStore()
      if (!userStore.isLoggedIn && this.queue.length === 0) {
        // fallback to local storage
        this.queue = JSON.parse(localStorage.getItem("queue") || "[]")
      }
      return this.queue.some(q => q.id === episode.id)
    },

    /**
     * Set the current playing episode
     */
    setCurrentEpisode(episode) {
      this.currentEpisode = episode
    },

    /**
     * Play next or previous
     */
    playNext() {
      if (!this.currentEpisode) return
      const currentIndex = this.queue.findIndex(ep => ep.id === this.currentEpisode.id)
      if (currentIndex !== -1 && currentIndex < this.queue.length - 1) {
        this.currentEpisode = this.queue[currentIndex + 1]
      } else {
        // wrap around
        this.currentEpisode = this.queue[0] || null
      }
    },
    playPrevious() {
      if (!this.currentEpisode) return
      const currentIndex = this.queue.findIndex(ep => ep.id === this.currentEpisode.id)
      if (currentIndex > 0) {
        this.currentEpisode = this.queue[currentIndex - 1]
      } else {
        // go back to first episode if any
        this.currentEpisode = this.queue[0] || null
      }
    },

    /**
     * Dispatch a storage event so other tabs can sync if needed
     */
    sendStorageEvent() {
      window.dispatchEvent(new StorageEvent("storage", {
        key: "queue",
        newValue: JSON.stringify(this.queue)
      }))
    }
  }
})