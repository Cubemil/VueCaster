<template>
  <div class="searchbar">
    <img src="../assets/search_icon.png" height="18" class="search_icon"/>
    <input class="searchbar_input" type="text" placeholder="Which podcast do you want to play?" size="40"
           ref="inputField" @input="inputNotEmpty">
    <img src="../assets/cross_icon.png" height="16" class="delete_icon" ref="deleteIcon" @click="clearInput"/>
  </div>
</template>

<script>
export default {
  methods: {
    inputNotEmpty(event) {
      if (event.target.value.trim() !== '') {
        this.$refs.deleteIcon.style.visibility = 'visible';
      } else {
        this.$refs.deleteIcon.style.visibility = 'hidden';
      }
    },
    clearInput() {
      this.$refs.deleteIcon.style.visibility = 'hidden';
      this.$refs.inputField.value = '';
    }
  }
}
</script>

<style>
.searchbar {
  display: flex;
  justify-content: center;
}

.searchbar_input {
  background: #242424;
  height: 45px;
  border: 1px solid transparent;
  outline-color: transparent;
  border-radius: 28px;
  color: #fdfdfd;
  font-size: 14px;
  padding-left: 38px;
  padding-right: 38px;
  background-image: url('../assets/search_icon.png'); /* URL of your icon image */
  background-size: 16px; /* Adjust the size of the icon */
  background-position: 14px 50%; /* Adjust the position of the icon */
  background-repeat: no-repeat;
}

.searchbar_input::placeholder {
  color: #747474;
}

.searchbar_input:focus {
  background-image: url('../assets/hovered_search_icon.png'); /* URL of your icon image */
  background-size: 16px; /* Adjust the size of the icon */
  background-position: 14px 50%; /* Adjust the position of the icon */
  background-repeat: no-repeat;
}

.searchbar_input:hover {
  border: 1px solid #434343;
  background: #292929;
  background-image: url('../assets/hovered_search_icon.png'); /* URL of your icon image */
  background-size: 16px; /* Adjust the size of the icon */
  background-position: 14px 50%; /* Adjust the position of the icon */
  background-repeat: no-repeat;
}

.search_icon {
  position: relative;
  top: 16px;
  left: 30px;
  visibility: hidden;
}

.delete_icon {
  position: relative;
  top: 16px;
  right: 30px;
  visibility: hidden;
}
</style>

