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
        <h2 id="liked-podcasts-title">Liked Podcasts from {{ userStore.username }}</h2>
        <LikedPodcastsList/>
      </div>  
    </div>

    <div v-if="showSettings" id="settings-area">
      <h2>Profile Settings</h2>
      <div id="profile-settings-container">
        <div class="input-group">
          <h2>Change Profile Picture</h2>
          <input type="file" id="profile-picture-input" accept="image/*">
          <p v-if="profilePictureError" class="error-message">{{ profilePictureError }}</p>
        </div>  
        <button id="upload-profile-picture-btn" @click="changeProfilePicture">Change</button>

        <h2>Change username</h2>
        <div class="input-group">
          <input type="text" v-model="username" id="username-input" placeholder="New Username">
          <input type="text" v-model="confirmUsername" id="confirm-username-input" placeholder="Confirm New Username">
          <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
        </div>
        <button id="change-username-btn" @click="changeUsername">Change</button>

        <h2>Change password</h2>
        <div class="input-group">
          <input type="password" v-model="currentPassword" id="current-password-input" placeholder="Current Password">
          <input type="password" v-model="password" id="password-input" placeholder="New Password">
          <input type="password" v-model="confirmPassword" id="confirm-password-input" placeholder="Confirm New Password">
          <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        </div>
        <button id="change-password-btn" @click="changePassword">Change</button>

        <h2>Change email</h2>
        <div class="input-group">
          <input type="text" v-model="email" id="email-input" placeholder="New Email">
          <input type="text" v-model="confirmEmail" id="confirm-email-input" placeholder="Confirm New Email">
          <p v-if="emailError" class="error-message">{{ emailError }}</p>
        </div>
        <button id="change-email-btn">Change</button>

        <h2>Delete Account</h2>
        <div class="input-group">
          <p>This action is irreversible. Are you sure you want to delete your account?</p>
          <p>If so, type "Delete Account"</p>
          <input type="text" v-model="deleteAccountInput" id="delete-account-input" placeholder="...">
          <p v-if="deleteAccountError" class="error-message">{{ deleteAccountError }}</p>
        </div>
        <div class="input-group">
          <label>
            <input type="checkbox" v-model="confirmDeleteAccount" id="confirm-delete-account-checkbox">
            I understand that this action is irreversible.
          </label>
        </div>        
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
      profilePictureError: '',
      showSettings: false,
      username: '',
      confirmUsername: '',
      usernameError: '',
      currentPassword: '',
      password: '',
      confirmPassword: '',
      passwordError: '',
      email: '',
      confirmEmail: '',
      emailError: '',
      deleteAccountInput: '',
      confirmDeleteAccount: false,
      deleteAccountError: '',
      resultMessage: ''
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

        if (!response.ok) throw new Error('Failed to fetch user dashboard.')

        if (!body.data) {
          console.error('No user data found.')
          return
        }
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
        this.usernameError = "Both username fields are required."
        return
      }
      if (this.username !== this.confirmUsername) {
        this.usernameError = "Usernames do not match."
        return
      }
      this.usernameError = ''

      try {
        const response = await fetch(getApiUrl('/user/change-username'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.userStore.getToken}`
          },
          body: JSON.stringify({ username: this.username })
        })

        if (!response.ok) throw new Error('Failed to update username.')
        const result = await response.json()
        this.userStore.username = this.username
        this.resultMessage = result.message || 'Username updated successfully.'
      } catch (error) {
        this.usernameError = 'Error updating username. Please try again.'
      }
    },
    async changePassword() {
      if (!this.currentPassword || !this.password || !this.confirmPassword) {
        this.passwordError = "All password fields are required."
        return
      }
      if (this.password !== this.confirmPassword) {
        this.passwordError = "Passwords do not match."
        return
      }
      this.passwordError = ''

      try {
        const sendBody = {
          password: this.currentPassword,
          newPassword: this.password
        }

        console.log(sendBody)

        const response = await authFetch(getApiUrl('/user/change-password'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendBody)
        })

        if (!response.ok) throw new Error('Failed to update password.')
        const result = await response.json()
        this.resultMessage = result.message || 'Password updated successfully.'
      } catch (error) {
        this.passwordError = 'Error updating password. Please try again.'
      }
    },
    async changeEmail() {
      if (!this.email || !this.confirmEmail) {
        this.emailError = "Both email fields are required."
        return
      }
      if (this.email !== this.confirmEmail) {
        this.emailError = "Emails do not match."
        return
      }
      this.emailError = ''

      try {
        const response = await fetch(getApiUrl('/user/change-email'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.userStore.token}`
          },
          body: JSON.stringify({ email: this.email })
        })

        if (!response.ok) throw new Error('Failed to update email.')
        const result = await response.json()
        this.resultMessage = result.message || 'Email updated successfully.'
      } catch (error) {
        this.emailError = 'Error updating email. Please try again.'
      }
    },
    async changeProfilePicture() {
      const fileInput = document.getElementById('profile-picture-input')
      const file = fileInput.files[0]

      if (!file) {
        this.profilePictureError = 'Please select a file.'
        return
      }
      this.profilePictureError = ''

      const formData = new FormData()
      formData.append('profilePicture', file)

      try {
        const response = await fetch(getApiUrl('/user/change-picture'), {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.userStore.token}`
          },
          body: formData
        })

        if (!response.ok) throw new Error('Failed to upload profile picture.')
        const result = await response.json()
        this.profilePictureUrl = result.profilePictureUrl
      } catch (error) {
        this.profilePictureError = 'Error uploading profile picture. Please try again.'
      }
    },
    async deleteAccount() {
      if (!this.deleteAccountInput || this.deleteAccountInput !== 'Delete Account') {
        this.deleteAccountError = 'Please type "Delete Account" to confirm.'
        return
      }
      if (!this.confirmDeleteAccount) {
        this.deleteAccountError = 'Please confirm that you understand this action is irreversible.'
        return
      }
      this.deleteAccountError = ''

      try {
        const response = await fetch(getApiUrl('/user/delete-account'), {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${this.userStore.token}`
          }
        })

        if (!response.ok) throw new Error('Failed to delete account.')
        const result = await response.json()
        this.resultMessage = result.message || 'Account deleted successfully.'
        this.userStore.logout()
        this.$router.push('/login')
      } catch (error) {
        this.deleteAccountError = 'Error deleting account. Please try again.'
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
  width: 100%;
  overflow-y: auto;
  margin: 0 auto;
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

.error-message {
  color: #ff0000;
  font-size: 0.85rem;
  margin: 5px 0;
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
