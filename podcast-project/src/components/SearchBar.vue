<template>
  <div class="searchbar">
    <img src="../assets/cross_icon.png" height="16" class="placeholder_icon_left"/>
    <input class="searchbar_input" type="text" placeholder="Which podcast do you want to play?" size="34"
           ref="inputField" @input="inputNotEmpty" @keydown.enter="onEnterPress">
    <img src="../assets/cross_icon.png" height="16" class="delete_icon" ref="deleteIcon" @click="clearInput"/>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  methods: {
    inputNotEmpty(event) {
      if (event.target.value.trim() !== '') {
        this.$refs.deleteIcon.style.visibility = 'visible'
      } else {
        this.$refs.deleteIcon.style.visibility = 'hidden'
      }
    },
    clearInput() {
      this.$refs.deleteIcon.style.visibility = 'hidden'
      this.$refs.inputField.value = ''
    },
    async onEnterPress() {
  const query = this.$refs.inputField.value.trim();
  if (query !== '') {
    try {
      const response = await axios.get(`https://api.fyyd.de/0.2/search/podcast`, {
        params: { title: query }
      });
      const podcast = response.data[0];
      if (podcast) {
        console.log('Navigating to PodcastDetails with id:', podcast.id); // Debugging line
        this.$router.push({ name: 'PodcastDetails', params: { id: podcast.id } });
      } else {
        console.error('Podcast not found');
      }
    } catch (error) {
      console.error('Error searching for podcast:', error);
    }
  }
  }
}
}
</script>

<style>
.searchbar {
  display: flex;
  justify-content: center;
  padding-top: 10px;
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
  background-size: 15px; /* Adjust the size of the icon */
  background-position: 14px 50%; /* Adjust the position of the icon */
  background-repeat: no-repeat;
  font-family: Arial, Helvetica, sans-serif;
}

.searchbar_input::placeholder {
  color: #747474;
}

.searchbar_input:focus {
  background-image: url('../assets/hovered_search_icon.png'); /* URL of your icon image */
  background-size: 15px; /* Adjust the size of the icon */
  background-position: 14px 50%; /* Adjust the position of the icon */
  background-repeat: no-repeat;
}

.searchbar_input:hover {
  border: 1px solid #434343;
  background: #292929;
  background-image: url('../assets/hovered_search_icon.png'); /* URL of your icon image */
  background-size: 15px; /* Adjust the size of the icon */
  background-position: 14px 50%; /* Adjust the position of the icon */
  background-repeat: no-repeat;
}

.placeholder_icon_left {
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
