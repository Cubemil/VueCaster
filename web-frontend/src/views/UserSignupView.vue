<template>
  <div id="user-signup-view-container">
    <h1>Sign up to use VueCaster Pro</h1>

    <form id="user-signup-form" @submit.prevent="handleSignup">
      <div class="input-group">
        <input
          type="text"
          id="email"
          name="email"
          v-model="email"
          @blur="validateEmail"
          placeholder="Email"
          required
        />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>

      <div class="input-group">
        <input
          type="text"
          id="username"
          name="username"
          v-model="username"
          @blur="validateUsername"
          placeholder="username"
          required
        />
        <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
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
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
      </div>

      <div class="input-group">
        <input
          type="password"
          id="confirm-password"
          name="confirmPassword"
          v-model="confirmPassword"
          @blur="validateConfirmPassword"
          placeholder="Confirm Password"
          required
        />
        <p v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</p>
      </div>

      <button type="submit" id="signup-btn" :disabled="isSubmitting">Sign Up</button>
    </form>

    <div id="switch-to-login-area">
      Already have an account?
      <router-link to="/login">Log In</router-link>
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
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      emailError: false,
      usernameError: false,
      passwordError: false,
      confirmPasswordError: false,
      responseMessage: '',
      isSubmitting: false,
    }
  },
  methods: {
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.email)
        this.emailError = 'Please enter an email address.'
      else if (!emailRegex.test(this.email))
        this.emailError = 'Please enter a valid email address.'
      else
        this.emailError = ''
    },
    validateUsername() {
      if (!this.username)
        this.usernameError = 'Please enter a username.'
      else if (this.username.length < 4)
        this.usernameError = 'Username must contain at least 4 characters.'
      else
        this.usernameError = ''
    },
    validatePassword() {
      if (!this.password)
        this.passwordError = 'Please enter a password.'
      else if (this.password.length < 6)
        this.passwordError = 'Password must contain at least 6 characters.'
      else
        this.passwordError = ''
    },
    validateConfirmPassword() {
      if (!this.confirmPassword)
        this.confirmPasswordError = 'Please confirm your password.'
      else if (this.confirmPassword !== this.password)
        this.confirmPasswordError = 'Passwords do not match.'
      else
        this.confirmPasswordError = ''
    },
    async handleSignup() {
      this.validateEmail()
      this.validateUsername()
      this.validatePassword()
      this.validateConfirmPassword()

      if (
        this.isSubmitting   ||
        this.emailError     ||
        this.usernameError  ||
        this.passwordError  ||
        this.confirmPasswordError
      ) return

      this.isSubmitting = true

      if (this.responseMessage !== '') {
        this.isSubmitting = false
        return
      }

      const signupData = {
        email: this.email,
        username: this.username,
        password: this.password,
      }

      try {
        const response = await fetch(getApiUrl('/user/signup'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(signupData)
        })

        if (!response.ok) {
          throw new Error('HTTP error! status: ' + response.status)
        }

        const result = await response.json()
        this.responseMessage = result.message
        console.log('Signup successful:', result)
        this.$router.push('/login')
      } catch (error) {
        console.error('Error singing up:', error)
      } finally {
        this.isSubmitting = false
      }
    }
  }
}
</script>

<style scoped>
#user-signup-view-container {
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

#user-signup-form {
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

#signup-btn {
  background: #1db954;
  color: #ffffff;
  padding: 10px;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

#signup-btn:hover {
  background: #1ed760;
  transform: scale(1.05);
}

#switch-to-login-area {
  margin-top: 20px;
  font-size: 0.85rem;
}

#switch-to-login-area a {
  color: #1db954;
  text-decoration: none;
}

#switch-to-login-area a:hover {
  color: #1ed760;
  text-decoration: underline;
}
</style>