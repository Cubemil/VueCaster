<template>
  <div id="user-dashboard-view-container">
    
    <div v-if="!showSettings" id="profile-area">
      <h2>Profile of {{ userStore.username }}</h2>
      <div id="profile-picture-container">
        <img
          :src="profilePictureUrl"
          alt="Profile Picture" 
          id="profile-picture"
        >
      </div>
      <div id="liked-podcast-container">
        <h3 id="liked-podcasts-title">Liked Podcasts from {{ userStore.username }}</h3>
        <LikedPodcastsList/>
      </div>  
    </div>

    <div v-if="showSettings" id="settings-area">
      <h2>Profile Settings</h2>
      <div id="profile-settings-container">
        <h3>Change Profile Picture</h3>
        <input type="file" id="profile-picture-input" accept="image/*">
        <button id="upload-profile-picture-btn">Upload</button>

        <h3>Change username</h3>
        <input type="text" id="username-input" placeholder="New Username">
        <input type="text" id="confirm-username-input" placeholder="Confirm New Username">
        <button id="change-username-btn">Change</button>

        <h3>Change password</h3>
        <input type="password" id="password-input" placeholder="New Password">
        <input type="password" id="confirm-password-input" placeholder="Confirm New Password">
        <button id="change-password-btn">Change</button>

        <h3>Change email</h3>
        <input type="text" id="email-input" placeholder="New Email">
        <input type="text" id="confirm-email-input" placeholder="Confirm New Email">
        <button id="change-email-btn">Change</button>

        <h3>Delete Account</h3>
        <button id="delete-account-btn">Delete Account</button>

      </div>
    </div>

    <div id="actions-area">
      <button v-if="!showSettings" id="settings-btn" @click="toggleProfileSettings">Profile Settings</button>
      <button v-if="showSettings" id="settings-btn" @click="toggleProfileSettings">Back to Profile</button>
      <button id="logout-btn" @click="logout">Log Out</button>
    </div>
  </div>
</template>

<script setup>
import LikedPodcastsList from "@/components/LikedPodcastsList.vue"
import { getApiUrl } from '@/api'
import { authFetch } from '@/utils/authFetch'
import { useUserStore } from '@/stores/user'
</script>

<script>
export default {
  data() {
    return {
      userStore: useUserStore(),
      profileDetails: null,
      profilePictureUrl: "https://via.placeholder.com/150?text=User" || this.profileDetails.profilePictureUrl,
      showSettings: false,
      username: '',
      confirmUsername: '',
      password: '',
      confirmPassword: '',
      email: '',
      confirmEmail: ''
    }
  },
  mounted() {
    this.getUserDashboard()
  },
  watch: {
    $route() {
      this.getUserDashboard()
    }
  },
  methods: {
    async getUserDashboard() {
      try {
        const url = getApiUrl('/user/dashboard')

        const response = await authFetch(url, {
          method: 'GET'
        })
        const body = await response.json()

        this.profileDetails = body.data
      } catch (err) {
        console.error('Error fetching podcast details:', err)
      }
    },
    toggleProfileSettings() {
      this.showSettings = !this.showSettings
    },
    logout() {
      this.userStore.logout()
      this.$router.push('/login')
    },
    async changeUsername() {
      if (!this.username || !this.confirmUsername) {
        alert("Both username fields are required.")
        return
      }

      if (this.username !== this.confirmUsername) {
        alert("Usernames do not match.")
        return
      }

      try {
        const response = await fetch(getApiUrl('/user/update-username'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.userStore.token}`
          },
          body: JSON.stringify({ username: this.username })
        })

        if (!response.ok) throw new Error('Failed to update username.')

        const result = await response.json()
        this.userStore.username = this.username
        alert(result.message || 'Username updated successfully.')
      } catch (error) {
        console.error('Error updating username:', error)
        alert('Error updating username. Please try again.')
      }
    },
    async changePassword() {
      if (!this.password || !this.confirmPassword) {
        alert("Both password fields are required.")
        return
      }

      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match.")
        return
      }

      if (this.password.length < 6) {
        alert("Password must be at least 6 characters long.")
        return
      }

      try {
        const response = await fetch(getApiUrl('/user/update-password'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.userStore.token}`
          },
          body: JSON.stringify({ password: this.password })
        })

        if (!response.ok) throw new Error('Failed to update password.')

        const result = await response.json()
        alert(result.message || 'Password updated successfully.')
      } catch (error) {
        console.error('Error updating password:', error)
        alert('Error updating password. Please try again.')
      }
    },
    async changeEmail() {
      if (!this.email || !this.confirmEmail) {
        alert("Both email fields are required.")
        return
      }

      if (this.email !== this.confirmEmail) {
        alert("Emails do not match.")
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        alert("Please enter a valid email address.")
        return
      }

      try {
        const response = await fetch(getApiUrl('/user/update-email'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.userStore.token}`
          },
          body: JSON.stringify({ email: this.email })
        })

        if (!response.ok) throw new Error('Failed to update email.')

        const result = await response.json()
        this.userStore.email = this.email
        alert(result.message || 'Email updated successfully.')
      } catch (error) {
        console.error('Error updating email:', error)
        alert('Error updating email. Please try again.')
      }
    },
    async uploadProfilePicture() {
      const fileInput = document.getElementById('profile-picture-input')
      if (!fileInput || !fileInput.files[0]) {
        alert("Please select a profile picture to upload.")
        return
      }

      const formData = new FormData()
      formData.append('profilePicture', fileInput.files[0])

      try {
        const response = await fetch(getApiUrl('/user/update-profile-picture'), {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.userStore.token}`
          },
          body: formData
        })

        if (!response.ok) throw new Error('Failed to upload profile picture.')

        const result = await response.json()
        this.profilePictureUrl = result.profilePictureUrl // Update local profile picture
        alert(result.message || 'Profile picture updated successfully.')
      } catch (error) {
        console.error('Error uploading profile picture:', error)
        alert('Error uploading profile picture. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
#user-dashboard-view-container {
  display: flex;
  flex-direction: column;
  font-size: 100%;
  width: 75%;
  margin: 0 auto;
  overflow: hidden;
  padding: 20px;
}

#profile-area, #settings-area {
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

#profile-picture-container {
  margin: 20px 0;
  display: flex;
}

#profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1db954;
  transition: all 0.3s;
}

#profile-picture:hover {
  transform: scale(1.05);
  border-color: #1ed760;
}

button {
  background: #1db954;
  color: #ffffff;
  padding: 10px 30px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
  margin: 10px 0;
  transition: all 0.3s;
}

button:hover {
  background: #1ed760;
  transform: scale(1.05);
}

#settings-btn {
  background: #333333;
  color: #e0e0e0;
  margin-right: 1rem;
}

#settings-btn:hover {
  background: #d6d6d6;
}

#delete-account-btn {
  background: #ff0000;
}

#delete-account-btn:hover {
  background: #e60000;
}

input[type="text"],
input[type="password"],
input[type="file"] {
  display: block;
  padding: 10px;
  margin: 10px 0 20px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus,
input[type="file"]:focus {
  border-color: #1db954;
  outline: none;
  box-shadow: 0 0 4px rgba(29, 185, 84, 0.4);
}

#actions-area {
  text-align: center;
  margin-top: 20px;
}

@media screen and (max-width: 768px) {
  #profile-area,
  #settings-area {
    padding: 15px;
    font-size: 120%;
  }

  button {
    font-size: 0.9rem;
  }

  input[type="text"],
  input[type="password"],
  input[type="file"] {
    font-size: 0.9rem;
  }
}
</style>
