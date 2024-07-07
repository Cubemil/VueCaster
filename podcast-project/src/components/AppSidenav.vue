<template>
  <nav id="app-sidenav">
    <ul id="app-sidenav-item-list">
      <li class="app-sidenav-item">
        <router-link id="router-link-home" to="/home" class="router-link">
          <i class="fas fa-home nav-icon"></i>
          Home
        </router-link>
      </li>
      <li class="app-sidenav-item">
        <router-link id="router-link-search" to="/search" class="router-link">
          <i class="fas fa-search nav-icon"></i>
          Search
        </router-link>
      </li>
      
      <li class="app-sidenav-item">
        <router-link id="router-link-saved" to="/home" class="router-link"> <!-- Update to /saved later -->
          <i class="fas fa-bookmark nav-icon"></i>
          Saved Podcasts
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'AppSidenav',
};
</script>

<style scoped>
#app-sidenav {
  padding: 20px;
  background: transparent;
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
  align-items: left;
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

</style>
