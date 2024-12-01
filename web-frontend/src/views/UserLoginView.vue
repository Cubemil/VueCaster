<template>
  <div id="user-login-view-container">
    <h1>Login to VueCaster Pro</h1>

    <form id="user-login-form" @submit.prevent="handleLogin">
      <div class="input-group">
        <input
          type="text"
          id="emailOrUsername"
          name="emailOrUsername"
          v-model="emailOrUsername"
          @blur="validateEmailOrUsername"
          placeholder="Email or Username"
          required
        />
        <p v-if="emailOrUsernameError" class="error-message">Please enter a valid username or email address.</p>
      </div>

      <div class="input-group">
        <input
          type="password"
          id="password"
          name="password"
          v-model="password"
          placeholder="Password"
          @blur="validatePassword"
          required
        />
        <p v-if="passwordError" class="error-message">Please enter a valid password.</p>
      </div>

      <div class="remember-me-area">
        <label for="remember-me" class="custom-checkbox-label">
          <input type="checkbox" id="remember-me" name="rememberMe" v-model="rememberMe"/>
          <span class="custom-checkbox"></span>
          Remember me
        </label>
      </div>

      <button type="submit" id="login-btn" :disabled="isSubmitting">Log In</button>
    </form>

    <div id="password-reset">
      <router-link to="/forgot-password">Forgot your password?</router-link>
    </div>

    <div id="switch-to-register-area">
      Don't have an account?
      <router-link to="/register">Register</router-link>
    </div>

  </div>
</template>

<script setup>
import { getApiUrl } from '@/api'
</script>

<script>
export default {
  data() {
    return {
      emailOrUsername: '',
      password: '',
      emailOrUsernameError: false,
      passwordError: false,
      rememberMe: false,
      responseMessage: '',
      isSubmitting: false
    }
  },
  methods: {
    validateEmailOrUsername() {
      const emailOrUsernameRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (this.emailOrUsername !== '')
        this.emailOrUsernameError = !this.emailOrUsername || !emailOrUsernameRegex.test(this.emailOrUsername)
    },
    validatePassword() {
      if (this.password !== "")
        this.passwordError = !this.password || this.password.length < 4
    },
    async handleLogin() {
      this.validateEmailOrUsername()
      this.validatePassword()

      if (this.isSubmitting || this.emailOrUsernameError || this.passwordError) return
      this.isSubmitting = true

      if (this.responseMessage !== '') {
        this.isSubmitting = false
        return
      }

      // TODO this says email now but it should be email or username later (need to update the API)
      const loginData = {
        email: this.emailOrUsername,
        password: this.password,
        rememberMe: this.rememberMe
      }

      try {
        const response = await fetch(getApiUrl('/user/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        })
        console.log('Login data: ', loginData)
        console.log('Posting to: ', getApiUrl('/user/login'))

        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status)
        }

        const result = await response.json()
        this.responseMessage = result.message

        if (result.token) {
          document.cookie = `token=${result.token}; path=/`
          this.$router.push('/')
        } else {
          this.responseMessage = 'Invalid credentials.'
        }
      } catch (error) {
        console.error('Error logging in:', error)
        this.responseMessage = 'An error occurred while logging in. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
#user-login-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
  color: #ffffff;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

#user-login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #181818;
  color: #ffffff;
  margin-bottom: 15px;
}

.error-message {
  color: #ff0000;
  font-size: 0.85rem;
  margin-top: 5px;
}

.remember-me-area {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #ffffff;
  font-size: 0.9rem;
}

.custom-checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  padding-left: 30px;
  user-select: none;
  line-height: 1;
}

.custom-checkbox-label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-checkbox {
  position: absolute;
  top: 50%;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #181818;
  border: 1px solid #ccc;
  border-radius: 4px;
  transform: translateY(-50%);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.custom-checkbox-label:hover .custom-checkbox {
  border-color: #1db954;
}

.custom-checkbox-label input:checked ~ .custom-checkbox {
  background-color: #1db954;
  border-color: #1db954;
}

.custom-checkbox::after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox-label input:checked ~ .custom-checkbox::after {
  display: block;
}

.custom-checkbox::after {
  left: 6px;
  top: 3px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

#login-btn {
  background: #1db954;
  color: #ffffff;
  padding: 10px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

#login-btn:hover {
  background: #1ed760;
  transform: scale(1.05);
}

#password-reset {
  margin-top: 20px;
  font-size: 0.85rem;
}

#password-reset a {
  color: #1db954;
  text-decoration: none;
}

#password-reset a:hover {
  color: #1ed760;
  text-decoration: underline;
}

#switch-to-register-area {
  margin-top: 20px;
  font-size: 0.85rem;
}

#switch-to-register-area a {
  color: #1db954;
  text-decoration: none;
}

#switch-to-register-area a:hover {
  color: #1ed760;
  text-decoration: underline;
}
</style>