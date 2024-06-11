<template>
  <div class="searchbar">
    <img src="../assets/cross_icon.png" height="16" class="placeholder_icon_left"/>
    <input  class="searchbar_input" type="text" placeholder="What do you want to play?" size="40"
            ref="inputField" @input="inputNotEmpty" @keydown.enter="onEnterPress" @click="onClick">
    <img src="../assets/cross_icon.png" height="16" class="delete_icon" ref="deleteIcon" @click="clearInput"/>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {}
  },
  methods: {
    inputNotEmpty() {
      if (this.$refs.inputField.value !== '') {
        this.$refs.deleteIcon.style.visibility = 'visible';
      } else {
        this.$refs.deleteIcon.style.visibility = 'hidden';
      }
    },
    clearInput() {
      this.$refs.inputField.value = '';
      this.$refs.deleteIcon.style.visibility = 'hidden';
      this.$emit('clear-search');  // Emit an event to clear the search results in the parent component
    },
    async onEnterPress() {
      if (this.$refs.inputField.value !== '') {
        this.$refs.inputField.style.outlineWidth = '0px';
        this.$refs.inputField.blur();
        await this.getPodcastData();
      }
    },
    async getPodcastData() {
      try {
        if (this.$refs.inputField.value !== '') {
          const podcastName = this.$refs.inputField.value.trim().toLowerCase();
          let url = new URL('https://api.fyyd.de/0.2/search/podcast/');
          url.searchParams.append('title', podcastName);
          const response = await fetch(url);
          const body = await response.json();
          const podcasts = body.data.map(podcast => ({
            id: podcast.id,
            title: podcast.title,
            author: podcast.author,
            image: podcast.layoutImageURL,
            url: podcast.url
          }));
          this.$emit('search-performed', podcasts);  // emits the search results to the parent component
        }
      } catch (err) {
        console.error('Podcast could not be found.', err);
      }
    },
  }
}
</script>

<style scoped>
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
  background-image: url('../assets/search_icon.png'); /* icon image */
  background-size: 15px; /* icon size */
  background-position: 14px 50%; /* icon position */
  background-repeat: no-repeat;
  font-family: Arial, Helvetica, sans-serif;
}

.searchbar_input::placeholder {
  color: #747474;
}

.searchbar_input:focus {
  background-image: url('../assets/hovered_search_icon.png'); /* icon image */
  background-size: 15px; /* icon size */
  background-position: 14px 50%; /* icon position */
  background-repeat: no-repeat;
}

.searchbar_input:hover {
  border: 1px solid #434343;
  background: #292929;
  background-image: url('../assets/hovered_search_icon.png'); /* icon image */
  background-size: 15px; /* icon size */
  background-position: 14px 50%; /* icon position */
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
  visibility: visible;
}
</style>
