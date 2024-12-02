<template>
<div id="top-bar-container">
	<div id="left-section">
	  <i class="fas fa-ellipsis-h"></i>
  </div>
  <div id="right-section">
		<router-link :to="redirectPath" class="router-link" id="log-in-link">
			<span id="log-in-text" v-if="userStore.username">Welcome, {{ userStore.username }}!</span>
			<span id="log-in-text" v-else>Log in</span>
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

#log-in-text {
	white-space: nowrap;
	margin-right: 1%;
}

#log-in-link {
	display: flex;
	align-items: center;
	gap: 5px;
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
</style>