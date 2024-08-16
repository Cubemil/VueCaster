<template>
  <div id="searchbar-container">
    <i class="fas fa-search" id="search-icon" @click="fetchPodcasts" aria-label="Perform search"></i>
    <input id="searchbar-input" type="text" placeholder="What do you want to play?" size="40"
           ref="inputField" @input="inputNotEmpty" @keydown.enter="fetchPodcasts" autocomplete="off">
    <i class="fas fa-times" id="delete-icon" ref="deleteIcon" @click="clearInput"
       aria-label="Clear search bar input"></i>
    <i v-if="isLoading" class="fas fa-spinner fa-spin" id="loading-indicator"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoading: false,
      errorMessage: ''
    }
  },
  methods: {
    inputNotEmpty() {
      const inputField = this.$refs.inputField;
      const deleteIcon = this.$refs.deleteIcon;
      if (inputField && deleteIcon) {
        if (inputField.value !== '') {
          deleteIcon.style.visibility = 'visible';
        } else {
          deleteIcon.style.visibility = 'hidden';
        }
      }
    },
    clearInput() {
      const inputField = this.$refs.inputField;
      const deleteIcon = this.$refs.deleteIcon;
      if (inputField && deleteIcon) {
        inputField.value = '';
        deleteIcon.style.visibility = 'hidden';
        this.$emit('clear-search');  // Emit an event to clear the search results in the parent component
      }
    },
    async fetchPodcasts() {
      const inputField = this.$refs.inputField;
      if (inputField && inputField.value !== '') {
        inputField.style.outlineWidth = '0px';
        inputField.blur();
        await this.getPodcastData();
      }
    },
    async getPodcastData() {
      this.isLoading = true;
      this.errorMessage = '';
      try {
        const inputField = this.$refs.inputField;
        if (inputField && inputField.value !== '') {
          const podcastName = inputField.value.trim().toLowerCase();
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
    },
  }
}
</script>

<style scoped>
#searchbar-container {
  display: flex;
  align-items: center;
  background: #242424;
  border-radius: 28px;
  margin-top: 1px;
  padding: 0 15px;
  height: 50px;
  width: 100%;
  max-width: 600px;
}

#searchbar-container:focus-within {
  box-shadow: 0 0 0 1px #fdfdfd;
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
  height: 3em;
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
