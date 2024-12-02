<template>
  <div id="podcast-view-container">
    <div id="profile-area">
      <h2>Profile of {{ userStore.username }}</h2>
      <div id="liked-podcast-container">
        <h3>Liked Podcasts</h3>
        <LikedPodcastsList/>
      </div>  
    </div>
    <div id="logout-area">
      <button id="logout-btn" @click="logout">Log Out</button>
    </div>
  </div>
</template>

<script setup>
import LikedPodcastsList from "@/components/LikedPodcastsList.vue"
import { getApiUrl } from '@/api'
import { authFetch } from '@/auth'
import { useUserStore } from '@/stores/user'
</script>

<script>
export default {
  data() {
    return {
      userStore: useUserStore(),
      profileDetails: null,
    }
  },
  mounted() {
    this.getUserProfile()
  },
  watch: {
    $route() {
      this.getUserProfile()
    }
  },
  methods: {
    async getUserProfile() {
      try {
        const url = getApiUrl('/user/profile')

        const response = await authFetch(url)
        const body = await response.json()

        this.profileDetails = body.data
      } catch (err) {
        console.error('Error fetching podcast details:', err)
      }
    },
    logout() {
      this.userStore.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
#podcast-view-container {
  display: flex;
  flex-direction: row;
  padding: 1%;
  font-size: 100%;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

#details-area {
  flex: 1 1 50%;
  display: flex;
  align-items: flex-start;
  overflow-x: hidden;
}

#episodes-area {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 2%;
  overflow-x: hidden;
}

#logout-btn {
  background: #1db954;
  color: #ffffff;
  padding: 10px 30px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
  transition: all 0.3s;
}

#logout-btn:hover {
  background: #1ed760;
  transform: scale(1.05);
}

#logout-area {
  margin-top: 20px;
  text-align: center;
}

@media screen and (max-width: 768px) {
  #profile-view-container {
    flex-direction: column;
    overflow: auto;
    font-size: 150%;
    max-width: 80vw;
  }

  #details-area, #logout-area {
    flex: none;
    width: 100%;
    overflow-x: hidden;
  }
}
</style>
