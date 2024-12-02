<template>
  <div id="podcast-view-container">
    <div id="profile-area">
      <h2>Profile of {{ userStore.username }}</h2>
      <div id="profile-picture-container">
        <img
          :src="profilePictureUrl"
          alt="Profile Picture" 
          id="profile-picture"
        >
      </div>
      <div id="liked-podcast-container">
        <h3 id="liked-podcasts-title">Liked Podcasts from {{userStore.username }}</h3>
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
      profilePictureUrl: "https://via.placeholder.com/150?text=User" || this.profileDetails.profilePictureUrl
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
  font-size: 100%;
  width: 100%;
  overflow: hidden;
}

#profile-area {
  flex: 1 1 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2% 2%;
  overflow-x: hidden;
}

#profile-picture-container {
  margin: 20px 0;
}

#profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1db954;
  transition: all 0.3s;
}

#liked-podcasts-title {
  margin-bottom: -70px;
}

#details-area {
  flex: 1 1 50%;
  display: flex;
  align-items: flex-start;
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
