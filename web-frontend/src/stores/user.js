import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", {
  state: () => {
    // on startup also check session storage
    const storedUsername = localStorage.getItem("username") || sessionStorage.getItem("username")
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token")
    const storedProfilePictureUrl = localStorage.getItem("profilePictureUrl") || sessionStorage.getItem("profilePictureUrl")

    return {
      username: storedUsername || null,
      token: storedToken || null,
      profilePictureUrl: storedProfilePictureUrl || null
    }
  },
  getters: {
    getUsername: (state) => state.username,
    isLoggedIn: (state) => !!state.token,
    getToken: (state) => state.token,
    getProfilePictureUrl: (state) => state.profilePictureUrl
  },
  actions: {
    login(username, token, rememberMe) {
      if (!username || !token) {
        throw new Error("Invalid login credentials.")
      }

      this.username = username
      this.token = token
      
      // store token only in session when user doesn't want their credentials to be remembered
      const storage = rememberMe ? localStorage : sessionStorage
      storage.setItem("token", token)
      storage.setItem("username", username)
    },
    logout() {
      this.username = null
      this.token = null

      // clear from all storages
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("username")
    }
  }
})