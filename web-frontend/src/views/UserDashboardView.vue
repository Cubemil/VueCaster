<template>
  <div id="user-dashboard-view-container">
    <!-- Profile Overview Section -->
    <div v-if="!showSettings" id="profile-area">
      <h2>Profile of {{ userStore.username }}</h2>
      <div id="profile-picture-container">
        <img
          :src="profilePictureUrl"
          alt="Profile Picture"
          id="profile-picture"
        />
      </div>
      <div id="liked-podcast-container">
        <h2 id="liked-podcasts-title">Liked Podcasts from {{ userStore.username }}</h2>
        <LikedPodcastsList />
      </div>
    </div>

    <!-- Profile Settings Section -->
    <div v-if="showSettings" id="settings-container">
      <h2>Profile Settings</h2>
      
      <div id="settings-layout">
        <div id="profile-picture-section">
          <div id="profile-picture-container">
            <img
              :src="profilePictureUrl"
              alt="Profile Picture"
              id="profile-picture-large"
            />
          </div>
          <div id="change-profile-picture">
            <h3>Change Profile Picture</h3>
            <div class="input-group">
              <input type="file" id="profile-picture-input" accept="image/*" />
              <p v-if="profilePictureError" class="error-message">{{ profilePictureError }}</p>
            </div>
            <button @click="changeProfilePicture">Change</button>
          </div>
        </div>

        <div id="account-settings-section">
          <h3>Change Account Information</h3>
          <div id="settings-actions">
            <div>
              <button @click="toggleSetting('username')">Change Username</button>
              <transition name="slide">
                <div v-if="currentSetting === 'username'" class="settings-area">
                  <h4>Change Username</h4>
                  <div class="input-group">
                    <input type="text" v-model="username" placeholder="New Username" />
                    <input type="password" v-model="currentPasswordForUsername" placeholder="Current Password" />
                    <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
                  </div>
                  <button @click="changeUsername">Change</button>
                  <button class="cancel-btn" @click="closeSetting">Cancel</button>
                </div>
              </transition>
            </div>

            <div>
              <button @click="toggleSetting('password')">Change Password</button>
              <transition name="slide">
                <div v-if="currentSetting === 'password'" class="settings-area">
                  <h4>Change Password</h4>
                  <div class="input-group">
                    <input type="password" v-model="password" placeholder="New Password" />
                    <input type="password" v-model="confirmPassword" placeholder="Confirm New Password" />
                    <input type="password" v-model="currentPasswordForPassword" placeholder="Current Password" />
                    <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
                  </div>
                  <button @click="changePassword">Change</button>
                  <button class="cancel-btn" @click="closeSetting">Cancel</button>
                </div>
              </transition>
            </div>

            <div>
              <button @click="toggleSetting('email')">Change Email</button>
              <transition name="slide">
                <div v-if="currentSetting === 'email'" class="settings-area">
                  <h4>Change Email</h4>
                  <div class="input-group">
                    <input type="email" v-model="email" placeholder="New Email" />
                    <input type="email" v-model="confirmEmail" placeholder="Confirm New Email" />
                    <input type="password" v-model="currentPasswordForEmail" placeholder="Current Password" />
                    <p v-if="emailError" class="error-message">{{ emailError }}</p>
                  </div>
                  <button @click="changeEmail">Change</button>
                  <button class="cancel-btn" @click="closeSetting">Cancel</button>
                </div>
              </transition>
            </div>
          </div>

          <h3>Account Deletion</h3>
          <div>
            <button class="delete-btn" @click="toggleSetting('deleteAccount')">Delete Account</button>
            <transition name="slide">
              <div v-if="currentSetting === 'deleteAccount'" class="settings-area">
                <h4>Delete Account</h4>
                <div class="input-group">
                  <p>This action is irreversible. Are you sure you want to delete your account?</p>
                  <p>If so, type "Delete Account"</p>
                  <input type="text" v-model="deleteAccountInput" placeholder="Type here..." />
                  <p v-if="deleteAccountError" class="error-message">{{ deleteAccountError }}</p>
                  <label>
                    <input type="checkbox" v-model="confirmDeleteAccount" />
                    I understand that this action is irreversible.
                  </label>
                </div>
                <button class="delete-btn" @click="deleteAccount">Delete Account</button>
                <button class="cancel-btn" @click="closeSetting">Cancel</button>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Buttons Section -->
    <div id="actions-area">
      <button v-if="!showSettings" class="cancel-btn" @click="toggleSettings">Profile Settings</button>
      <button v-if="showSettings" class="cancel-btn" @click="toggleSettings">Back to Profile</button>
      <button @click="logout">Log Out</button>
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
      currentPasswordForUsername: '',
      username: '',
      usernameError: '',
      currentPasswordForPassword: '',
      password: '',
      confirmPassword: '',
      passwordError: '',
      currentPasswordForEmail: '',
      email: '',
      confirmEmail: '',
      emailError: '',
      deleteAccountInput: '',
      confirmDeleteAccount: false,
      deleteAccountError: '',
      resultMessage: '',
      showSettings: true,
      currentSetting: ''
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
        const response = await authFetch(getApiUrl('/user/dashboard'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendBody)
        })

        const body = await response.json()

        if (!response.ok) throw new Error('Server response to sending dashboard failed.')

        if (!body.data) {
          console.error('No user data found.')
          return
        }

        this.profileDetails = body.data
      } catch (err) {
        console.error('Error fetching user dashboard:', err)
      }
    },
    toggleSettings() {
      this.showSettings = !this.showSettings
      this.currentSetting = ''
    },
    toggleSetting(setting) {
      this.currentSetting = this.currentSetting === setting ? '' : setting
    },
    closeSetting() {
      this.currentSetting = ''
    },
    logout() {
      this.userStore.logout()
      this.$router.push('/login')
    },
    async changeUsername() {
      if (!this.currentPasswordForUsername || !this.username) {
        this.usernameError = "Current password and new username are required."
        return
      }
      this.usernameError = ''

      try {
        const sendBody = {
          password: this.currentPasswordForUsername,
          newUsername: this.username
        }

        const response = await authFetch(getApiUrl('/user/change-username'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendBody)
        })

        if (!response.ok) throw new Error('Failed to update username.')
        const result = await response.json()
        this.userStore.username = this.username
        this.resultMessage = result.message || 'Username updated successfully.'
      } catch (error) {
        this.usernameError = error.message || 'Error updating username. Please try again.'
      }
    },
    async changePassword() {
      if (!this.currentPasswordForPassword || !this.password || !this.confirmPassword) {
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
          currentPassword: this.currentPasswordForPassword,
          newPassword: this.password
        }

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
      if (!this.currentPasswordForEmail || !this.email || !this.confirmEmail) {
        this.emailError = "Current password and both email fields are required."
        return
      }
      if (this.email !== this.confirmEmail) {
        this.emailError = "Emails do not match."
        return
      }
      this.emailError = ''

      try {
        const sendBody = {
          currentPassword: this.currentPasswordForEmail,
          newEmail: this.email
        }

        const response = await fetch(getApiUrl('/user/change-email'), {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(sendBody)
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
            'Content-Type': 'application/json'
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
            'Content-Type': 'application/json'
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

#settings-container {
  max-width: 600px;
}

.cancel-btn {
  background: #333333;
  color: #cccccc;
}

#profile-picture-container {
  margin: 20px 0;
  display: flex;
}

#settings-actions {
  margin-bottom: 20px;
}

.settings-area {
  max-width: 100%;
  margin: 20px auto;
  padding-left: 13px;
  padding-top: 1px;
  padding-bottom: 15px;
  background-color: #1b1b1b;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.delete-btn {
  background: #ff0000;
}

.delete-btn:hover {
  background: #db6262;
}

#profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #1db954;
  margin: 0 auto 20px;
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
  margin: 10px 10px 0 0;
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

.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

input[type="text"],
input[type="password"],
input[type="file"],
input[type="email"] {
  display: block;
  width: 50%;
  padding: 10px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

input:focus {
  border-color: #1db954;
  outline: none;
  box-shadow: 0 0 4px rgba(29, 185, 84, 0.4);
}

#actions-area {
  text-align: center;
  margin-top: 20px;
}

h3 {
  margin-top: 20px;
  font-size: 1.25rem;
}

h4 {
  margin-top: 10px;
  font-size: 1.1rem;
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
