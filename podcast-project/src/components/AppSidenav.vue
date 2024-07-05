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
        <router-link id="router-link-saved" to="/saved" class="router-link">
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
}

#app-sidenav-item-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.app-sidenav-item {
  margin-bottom: 20px;
}

.router-link {
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

.router-link:hover {
  color: #ffffff;
}

</style>
