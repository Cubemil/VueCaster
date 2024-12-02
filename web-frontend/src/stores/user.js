import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", {
  state: () => {
    // on startup also check session storage
    const storedUsername = localStorage.getItem("username") || sessionStorage.getItem("username")
    const token = localStorage.getItem("token") || sessionStorage.getItem("token")

    return {
      username: storedUsername ? storedUsername : null,
      loggedIn: token ? true : false,
      token: token || null
    }
  },
  getters: {
    getUsername: (state) => state.username,
    isLoggedIn: (state) => state.loggedIn,
  },
  actions: {
    login(username, token, rememberMe) {
      this.username = username
      this.loggedIn = true
      this.token = token
      
      // store token only in session when user doesn't want their credentials to be remembered
      if (rememberMe) {
        localStorage.setItem("token", token)
        localStorage.setItem("username", username)
      } else {
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("username", username)
      }
    },
    logout() {
      this.user = null
      this.loggedIn = false
      this.token = null

      // clear from all storages
      localStorage.removeItem("token")
      localStorage.removeItem("username")
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("username")
    }
  }
})