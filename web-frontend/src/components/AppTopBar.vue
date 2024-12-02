<template>
<div id="top-bar-container">
	<div id="left-section">
	  <i class="fas fa-ellipsis-h"></i>
  </div>
  <div id="right-section">
		<span id="log-in-text" v-if="userStore.username">Welcome, {{ userStore.username }}!</span>
		<span id="log-in-text" v-else>Log in to use all features</span>
    <router-link :to="redirectPath" class="router-link">
      <i class="fas fa-user-circle"></i>
    </router-link>
	</div>
</div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
</script>

<script>
export default {
	computed: {
		userStore() {
			return useUserStore()
		},
		redirectPath() {
			return this.userStore.username ? '/profile' : '/login'
		}
	}
}
</script>

<style scoped>
#top-bar-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1% 2%;
}

#left-section, #right-section {
	display: flex;
	align-items: center;
	color: #B3B3B3;
}

.fa-ellipsis-h, .fa-user-circle {
	font-size: 2em;
}

.router-link {
  text-decoration: none;
  color: #B3B3B3;
  transition: all 0.3s;
}

.router-link:hover {
	transform: scale(1.1);
	color: #ffffff;
}

#log-in-text {
	margin-right: 1%;
}
</style>
