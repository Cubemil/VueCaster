<template>
  <div id="user-signup-view-container">
    <h1>Sign up to use VueCaster Pro</h1>

    <form id="user-signup-form" @submit.prevent="handleSignup">
      <label for="email">Email</label>
      <div class="input-group">
        <input
          type="text"
          id="email"
          name="email"
          v-model.trim="email"
          @blur="validateEmail"
          autocomplete="email"
          autofocus
          placeholder="Email"
          required
        />
        <p v-if="emailError" class="error-message">{{ emailError }}</p>
      </div>

      <label for="username">Username</label>
      <div class="input-group">
        <input
          type="text"
          id="username"
          name="username"
          v-model.trim="username"
          @blur="validateUsername"
          autocomplete="username"
          placeholder="username"
          required
        />
        <p v-if="usernameError" class="error-message">{{ usernameError }}</p>
      </div>

      <label for="password">Password</label>
      <div class="input-group password-group">
        <input
          :type="showPassword ? 'text' : 'password'"
          id="password"
          name="password"
          v-model.trim="password"
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

      <label for="confirm-password">Confirm Password</label>
      <div class="input-group password-group">
        <input
          :type="showConfirmPassword ? 'text' : 'password'"
          id="confirm-password"
          name="confirmPassword"
          v-model.trim="confirmPassword"
          @blur="validateConfirmPassword"
          placeholder="Confirm Password"
          required
        />
        <i
          :class="['toggle-password-icon', showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye']"
          @click="toggleConfirmPasswordVisibility"
        ></i>
        <p v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</p>
      </div>

      <button type="submit" id="signup-btn" :disabled="isSubmitting">Sign Up</button>
    
      <div id="message-area" v-if="errorMessage || successMessage">
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </div>
      
    </form>

    <div id="switch-to-login-area">
      Already have an account?
      <router-link to="/login">
        <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
        Log In
      </router-link>
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
      errorMessage: '',
      successMessage: '',
      isSubmitting: false,
      showPassword: false,
      showConfirmPassword: false
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
      else if (this.username.length > 20)
        this.usernameError = 'The maximum length for a username is 20 characters.'
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
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },
    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword
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

      // clear messages
      this.isSubmitting = true
      this.errorMessage = ''
      this.successMessage = ''

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

        const result = await response.json()

        if (response.ok) {
          this.successMessage = result.message || 'Signup successful!'
          this.clearInputFields()
        } else {
          this.errorMessage = result.message || 'An error occurred during signup.'
          console.error('Error signing up:', result)
        }
        
        //TODO decide whether to reroute to login after sign up or not -> would require global snackbar component
        //this.$router.push('/login')
      } catch (error) {
        this.errorMessage = 'A network or parsing error occurred.'
        console.error('Error signing up:', error)
      } finally {
        this.isSubmitting = false
      }
    },
    clearInputFields() {
      this.email = ''
      this.username = ''
      this.password = ''
      this.confirmPassword = ''
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

#message-area {
  margin-top: 10px;
}

.error-message, .success-message {
  color: #ff0000;
  font-size: 0.85rem;
  text-align: center;
}

.success-message {
  color: #1db954;
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