<template>
  <nav id="sidenav">
    <ul id="sidenav-item-list">
      <li class="sidenav-item">
        <router-link id="router-link-home" to="/home" class="nav-link">
          <i class="fas fa-home nav-icon"></i>
          Home
        </router-link>
      </li>
      <li class="sidenav-item">
        <router-link id="router-link-search" to="/search" class="nav-link">
          <i class="fas fa-search nav-icon"></i>
          Search
        </router-link>
      </li>
      <li class="sidenav-item">
        <router-link id="router-link-saved" to="/saved" class="nav-link">
          <i class="fas fa-bookmark nav-icon"></i>
          Saved Podcasts
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {};
</script>

<style scoped>
#sidenav {
  height: 100vh;
  width: 240px;
  background-color: #121212;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 15px 0 0 15px;
  overflow-y: auto;
}

#sidenav-item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.sidenav-item {
  margin-bottom: 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  color: #B3B3B3;
  text-decoration: none;
  font-size: 16px;
}

.nav-icon {
  margin-right: 16px;
  font-size: 20px;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link.active {
  color: #1db954;
}

/* Custom scrollbar styles */
#sidenav::-webkit-scrollbar {
  width: 12px;
}

#sidenav::-webkit-scrollbar-track {
  background: #121212;
  border-radius: 10px;
}

#sidenav::-webkit-scrollbar-thumb {
  background: #5a5959;
  border-radius: 10px;
}

#sidenav::-webkit-scrollbar-thumb:hover {
  background: #6e6d6d;
}
</style>
