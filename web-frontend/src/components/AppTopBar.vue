<template>
<div id="top-bar-container">
	<div id="left-section">
	  <i class="fas fa-ellipsis-h"></i>
  </div>
  <div id="right-section">
		<span id="welcome-text" v-if="userStore.username" aria-label="Show profile" title="Show profile">Welcome, {{ userStore.username }}!</span>
		<router-link :to="redirectPath" class="router-link" id="log-in-link" title="Log in" aria-label="Log in">
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

#left-section {
	flex-shrink: 0;
}

#right-section {
	flex-grow: 1;
	justify-content: flex-end;
}

#welcome-text {
	white-space: nowrap;
	margin-right: 1%;
	cursor: default;
}

#log-in-link {
	margin-left: 1%;
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
	transform: scale(1.01);
	color: #ffffff;
}
</style>