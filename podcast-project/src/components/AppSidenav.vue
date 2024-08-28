<template>
  <nav id="app-sidenav" :class="{ collapsed: isCollapsed }">
    
    <button 
      id="toggle-button"
      @click="toggleSidenav"
      :aria-label="isCollapsed ? 'Expand side navbar' : 'Collapse side navbar'" 
      :aria-expanded="!isCollapsed"
    >
      <i class="fas fa-bars"></i>
    </button>

    <ul id="app-sidenav-item-list">
      <li class="app-sidenav-item">
        <router-link id="router-link-home" to="/home" class="router-link" aria-current="page">
          <i class="fas fa-home nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Home</span>
        </router-link>
      </li>
      <li class="app-sidenav-item">
        <router-link id="router-link-search" to="/search" class="router-link">
          <i class="fas fa-search nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Search</span>
        </router-link>
      </li>
      <li class="app-sidenav-item">
        <router-link id="router-link-saved" to="/saved" class="router-link">
          <i class="fas fa-bookmark nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Saved Episodes</span>
        </router-link>
      </li>
      <li 
        id="liked-podcast-header"
        class="app-sidenav-item"
        @click="toggleLikedList"
        :class="{ active: showLikedList }"
      >
        <div class="router-link">
          <i class="fas fa-heart nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Liked Podcasts</span>
        </div>
        <i id="expand-arrow" v-if="!isCollapsed" :class="showLikedList ? 'fas fa-chevron-down' : 'fas fa-chevron-right'" class="chevron-icon"></i>
      </li>
    </ul>

    <LikedPodcastsList
      v-if="showLikedList && !isCollapsed"
      :isCollapsed="isCollapsed"
    />

  </nav>
</template>

<script setup>
import LikedPodcastsList from "@/components/LikedPodcastsList.vue"
</script>

<script>
export default {
  data() { 
    return { 
      isCollapsed: false,
      showLikedList: true
    }
  },
  methods: {
    toggleSidenav() {
      this.isCollapsed = !this.isCollapsed
    },
    toggleLikedList() {
      this.showLikedList = !this.showLikedList
    },
    handleResize() {
      if (window.innerWidth > 768 && this.isCollapsed)
        this.isCollapsed = false
    },
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }
}
</script>

<style scoped>
#app-sidenav {
  width: 100%;
  max-width: 15vw;
  padding-right: 6em;
  padding-left: 0.5em;
  background: transparent;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

#app-sidenav.collapsed {
  width: 60px;
}

#toggle-button {
  display: none;
  background: none;
  border: none;
  color: #B3B3B3;
  font-size: 20px;
  cursor: pointer;
  margin-bottom: 20px;
}

#app-sidenav-item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.app-sidenav-item {
  margin: 10px 0;
  width: 100%;
  display: flex;
  justify-content: center;
  transition: all 0.3s ease;
}

.router-link {
  display: flex;
  align-items: center;
  color: #B3B3B3;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.5em;
  width: 100%;
  padding: 10px 0;
}

#liked-podcast-header {
  display: flex;
  color: #B3B3B3;
  align-items: center;
}

.nav-icon {
  min-width: 2em;
  text-align: center;
  margin-right: 10px;
}

.nav-text {
  flex: 1;
  text-align: left;
  font-size: 0.8em;
}

.router-link:hover {
  color: #ffffff;
}

@media screen and (max-width: 768px) {
  #app-sidenav {
    max-width: 60px;
  }

  #toggle-button {
    display: block;
  }

  #app-sidenav-item-list {
    display: none;
  }

  #app-sidenav.collapsed #app-sidenav-item-list {
    display: block;
  }

  .router-link {
    display: none;
  }

  #app-sidenav.collapsed .router-link {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .nav-icon {
    margin-right: 0;
    margin-bottom: 5px;
  }
}
</style>