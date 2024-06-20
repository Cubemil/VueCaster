<template>
  <nav class="sidenav">
    <div class="sidenav-part-one">
      <ul class="sidenav-list">
        <li class="sidenav-item">
          <router-link class="router-link-home" to="/home">
            <div id="home-icon"></div>
            Home
          </router-link>
        </li>
        <li class="sidenav-item">
          <router-link class="router-link-search" to="/search">
            <div id="search-icon"></div>
            Search
          </router-link>
        </li>
      </ul>
    </div>
    <div class="sidenav-part-two">
      <ul class="sidenav-sub-list">
        <li class="sidenav-sub-item"><div id="bookmarks-icon"></div>Subs</li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.sidenav {
  height: 100vh;
}

.sidenav-part-one {
  height: 110px;
  width: 260px;
  background-color: #121212;
  border-radius: 10px;
}

.sidenav-part-two {
  position: relative;
  top: 8px;
  width: calc(100%); /* 274px left margin + 10px right margin */
  height: calc(100% - 138px); /* 10px top + 10px bottom */
  background-color: #121212;
  border-radius: 10px;
  overflow-y: scroll;
}

.sidenav-list {
  text-align: left;
  list-style-type: none;
  padding-left: 12px;
}

.sidenav-item {
  padding: 10px;
  display: flex;
}

.router-link-home {
  color: #B3B3B3;
  text-decoration: none;
}

.router-link-search {
  color: #B3B3B3;
  text-decoration: none;
  padding-left: 5px;
}

#home-icon {
  background-image: url("@/assets/home-icon.svg");
  display: inline-block;
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  top: 8px;
  padding-right: 12px;
}

#search-icon {
  background-image: url("@/assets/search-icon.png");
  display: inline-block;
  width: 20px;
  height: 20px;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  top: 4px;
  padding-right: 16px;
}

#bookmarks-icon {
  background-image: url("@/assets/bookmarks-icon.svg");
  display: inline-block;
  width: 24px;
  height: 24px;
  background-size: contain;
  background-repeat: no-repeat;
  position: relative;
  top: 7px;
  padding-right: 18px;
  cursor: pointer;
}

.sidenav-sub-list {
  list-style-type: none;
  color: #B3B3B3;
  padding-left: 26px;
  text-align: left;
}

.sidenav-sub-item {
  cursor: pointer;
}

/* width */
::-webkit-scrollbar {
  width: 12px;
}

/* Track */
::-webkit-scrollbar-track {
  background: rgba(18, 18, 18, 0);
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #5a5959;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #6e6d6d;
}
</style>

<script setup>
</script>