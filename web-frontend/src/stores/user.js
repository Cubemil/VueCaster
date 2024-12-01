import { defineStore } from 'pinia'

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    loggedIn: false,
  }),
  getters: {
    isLoggedIn: (state) => state.loggedIn,
    getUserData: (state) => state.user,
  },
  actions: {
    login(user) {
      this.user = user
      this.loggedIn = true
    },
    logout() {
      this.user = null
      this.loggedIn = false
    }
  }
})