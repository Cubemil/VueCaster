<template>
  <nav id="app-sidenav" :class="{ collapsed: isCollapsed }">
    
    <button id="toggle-button" @click="toggleSidenav">
      <i class="fas fa-bars"></i>
    </button>

    <ul id="app-sidenav-item-list">
      <li class="app-sidenav-item">
        <router-link id="router-link-home" to="/home" class="router-link">
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
        <router-link id="router-link-saved" to="/home" class="router-link"> <!-- Update to /saved later -->
          <i class="fas fa-bookmark nav-icon"></i>
          <span v-if="!isCollapsed" class="nav-text">Saved Podcasts</span>
        </router-link>
      </li>
    </ul>

  </nav>
</template>

<script>
export default {
  data() { 
    return { isCollapsed: false}
  },
  methods: {
    toggleSidenav() {
      this.isCollapsed = !this.isCollapsed
    },
    handleResize() {
      if (window.innerWidth > 768 && this.isCollapsed) {
        this.isCollapsed = false
      }
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
  padding: 20px;
  background: transparent;
  transition: width 0.3s;
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
}

#app-sidenav-item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.app-sidenav-item {
  margin-bottom: 20%;
}

.router-link {
  display: flex;
  align-items: center;
  color: #B3B3B3;
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
}

.nav-icon {
  margin-right: 16px;
  font-size: 20px;
}

.router-link:hover {
  color: #ffffff;
}

@media screen and (max-width: 768px) {
  #app-sidenav {
    width: 60px;
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
  }
  
}

</style>
