<template>
  <div id="user-login-view-container">
    <h1>Login to VueCaster Pro</h1>

    <form id="user-login-form" @submit.prevent="handleLogin">
      <label for="email-or-username">Email or Username</label>
      <div class="input-group">
        <input
          type="text"
          id="email-or-username"
          name="emailOrUsername"
          v-model="emailOrUsername"
          @blur="validateEmailOrUsername"
          placeholder="Email or Username"
          required
        />
        <p v-if="emailOrUsernameError" class="error-message">{{ emailOrUsernameError }}</p>
      </div>

      <label for="password">Password</label>
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          name="password"
          v-model="password"
          @blur="validatePassword"
          placeholder="Password"
          required
        />
        <i
          :class="['toggle-password-icon', showPassword ? 'fas fa-eye-slash' : 'fas fa-eye']"
          @click="togglePasswordVisibility"
        ></i>
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      </div>

      <div class="remember-me-area">
        <label for="remember-me" class="custom-checkbox-label">
          <input type="checkbox" id="remember-me" name="rememberMe" v-model="rememberMe"/>
          <span class="custom-checkbox"></span>
          Remember me
        </label>
      </div>

      <p v-if="responseMessage" class="api-error-message">{{ responseMessage }}</p>

      <button type="submit" id="login-btn" :disabled="isSubmitting">Log In</button>
    </form>

    <div id="password-reset">
      <router-link to="/forgot-password">Forgot your password?</router-link>
    </div>

    <div id="switch-to-signup-area">
      Don't have an account?
      <router-link to="/signup">Sign up</router-link>
    </div>

  </div>
</template>

<script setup>
import { getApiUrl } from '@/api'
import { useUserStore } from '@/stores/user'
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
      isSubmitting: false,
      showPassword: false
    }
  },
  methods: {
    validateEmailOrUsername() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isEmail = emailRegex.test(this.emailOrUsername)

      if (!this.emailOrUsername)
        this.emailOrUsernameError = 'Please enter an email or username.'
      else if (!isEmail && this.emailOrUsername.length < 4)
        this.emailOrUsernameError = 'Username must contain at least 4 characters.'
      else if (!isEmail && this.emailOrUsername.length > 20)
        this.emailOrUsernameError = 'Username must contain at most 20 characters.'
      else if (isEmail && this.emailOrUsername.length < 6)
        this.emailOrUsernameError = 'Email must contain at least 6 characters.'
      else if (isEmail && this.emailOrUsername.length > 100)
        this.emailOrUsernameError = 'Email must contain at most 100 characters.'
      else
        this.emailOrUsernameError = ''
    },
    validatePassword() {
      if (!this.password)
        this.passwordError = 'Please enter a password.'
      else if (this.password.length < 6)
        this.passwordError = 'Password must contain at least 6 characters.'
      else
        this.passwordError = ''
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    async handleLogin() {
      this.validateEmailOrUsername()
      this.validatePassword()

      if (this.isSubmitting || this.emailOrUsernameError || this.passwordError) return
    
      this.isSubmitting = true

      // checks for email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isEmail = emailRegex.test(this.emailOrUsername)

      // renames json key based on whether email or username is used
      const loginData = isEmail
        ? { email: this.emailOrUsername, password: this.password }
        : { username: this.emailOrUsername, password: this.password }

      try {
        const response = await fetch(getApiUrl('/user/login'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        })

        if (!response.ok) {
          const errorText = response.status === 401 ? 'Invalid credentials.' : 'An error occurred.'
          throw new Error(errorText)
        }

        const result = await response.json()
        this.responseMessage = result.message

        if (result.token) {
          const store = useUserStore()
          // 'rememberMe' is sent here since the store takes care of location of the credentials
          store.login(result.username, result.token, this.rememberMe)
          // reroute to home after successful login
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

label {
  font-size: 0.9rem;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #181818;
  color: #ffffff;
  margin-bottom: 10px;
}

.error-message {
  color: #ff0000;
  font-size: 0.85rem;
  margin-top: -5px;
}

.password-group {
  position: relative;
}

.toggle-password-icon {
  position: absolute;
  right: -5px;
  top: 19%;
  cursor: pointer;
  font-size: 1.2rem;
  color: #ccc;
  transition: all 0.3s;
}

.toggle-password-icon:hover {
  color: #fff;
  transform: scale(1.01);
}

.api-error-message {
  color: #ff0000;
  font-size: 0.85rem;
  margin-top: 10px;
  text-align: center;
}

.remember-me-area {
  display: flex;
  align-items: center;
  margin-top: 15px;
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

#switch-to-signup-area {
  margin-top: 20px;
  font-size: 0.85rem;
}

#switch-to-signup-area a {
  color: #1db954;
  text-decoration: none;
}

#switch-to-signup-area a:hover {
  color: #1ed760;
  text-decoration: underline;
}
</style>