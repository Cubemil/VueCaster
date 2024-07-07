<template>
  <div id="searchbar-container">
    <i class="fas fa-search" id="search-icon" @click="fetchPodcasts"></i>
    <input id="searchbar-input" type="text" placeholder="What do you want to play?" size="40"
           ref="inputField" @input="inputNotEmpty" @keydown.enter="fetchPodcasts" @click="onClick">
    <i class="fas fa-times" id="delete-icon" ref="deleteIcon" @click="clearInput"></i>
    <i v-if="isLoading" class="fas fa-spinner fa-spin" id="loading-indicator"></i>
  </div>
</template>

<script>
export default {
  name: 'AppSearchBar',
  data() {
    return {
      isLoading: false,
      errorMessage: ''
    }
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
    async fetchPodcasts() {
      if (this.$refs.inputField.value !== '') {
        this.$refs.inputField.style.outlineWidth = '0px';
        this.$refs.inputField.blur();
        await this.getPodcastData();
      }
    },
    async getPodcastData() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        if (this.$refs.inputField.value !== '') {
          const podcastName = this.$refs.inputField.value.trim().toLowerCase();
          let url = new URL('https://api.fyyd.de/0.2/search/podcast/');
          url.searchParams.append('title', podcastName);
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
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
        this.errorMessage = 'Podcast could not be found. Please try again later.';
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
#searchbar-container {
  display: flex;
  align-items: center;
  background: #242424;
  border-radius: 28px;
  padding: 0 15px;
  height: 45px;
  width: 100%;
  max-width: 600px;
}

#searchbar-container:focus-within { /*focus-within: matches an element if the element or any of its descendants are focused.*/
  border: 1px solid #fdfdfd;
}

#searchbar-input {
  border: none;
  outline: none;
  color: #fdfdfd;
  font-size: 14px;
  flex-grow: 1;
  padding-left: 10px;
  font-family: Arial, Helvetica, sans-serif;
  background: transparent;
}

#searchbar-input::placeholder {
  color: #747474;
}

#search-icon {
  color: rgb(179, 179, 179);
  cursor: pointer;
}

#delete-icon {
  color: rgb(179, 179, 179);
  visibility: hidden;
  cursor: pointer;
}

#delete-icon:hover {
  color: #fdfdfd;
}

#loading-indicator {
  color: #fdfdfd;
  font-size: 14px;
  margin-left: 10px;
}
</style>
