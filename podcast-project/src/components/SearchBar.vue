<template>
  <div class="searchbar">
    <img src="../assets/cross_icon.png" height="16" class="placeholder_icon_left"/>
    <input class="searchbar_input" type="text" placeholder="Which podcast do you want to play?" size="34"
           ref="inputField" @input="inputNotEmpty" @keydown.enter="getPodcastData">
    <img src="../assets/cross_icon.png" height="16" class="delete_icon" ref="deleteIcon" @click="clearInput"/>
  </div>
  <Categories v-show="showCategories"/>
  <PodcastDetails v-show="showPodcastDetails" v-bind:podcastTitle="podcastTitle" v-bind:url="url" v-bind:podcastAuthors="podcastAuthors"/>
</template>

<script>
import Categories from '/src/components/Categories.vue'
import PodcastDetails from '/src/components/PodcastDetails.vue'

export default {
  name: 'SearchBar',
  components: {Categories, PodcastDetails},
  data() {
    return {
      showCategories: true,
      showPodcastDetails: false,
      url: '',
      podcastTitle: '',
      podcastAuthors: ''
    }
  },
  methods: {
    inputNotEmpty(event) {
      if (event.target.value.trim() !== '') {
        this.$refs.deleteIcon.style.visibility = 'visible'
        this.showCategories = false;
        this.showPodcastDetails = true;
      } else {
        this.$refs.deleteIcon.style.visibility = 'hidden'
        this.showCategories = true;
        this.showPodcastDetails = false;
      }
    },
    clearInput() {
      this.$refs.deleteIcon.style.visibility = 'hidden'
      this.$refs.inputField.value = ''
      this.showCategories = true;
      this.showPodcastDetails = false;
    },
    async getPodcastData() {
      if (this.$refs.inputField.value !== '') {
        const podcastName = this.$refs.inputField.value.trim().toLowerCase();
        let url = new URL('https://api.fyyd.de/0.2/search/podcast/');
        url.searchParams.append('title', podcastName);
        const response = await fetch(url);
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);
        const body = await response.json();
        console.log(body);
        // clarifying data you want to show from the podcast
        this.podcastTitle = body.data[0].title;
        this.url = body.data[0].layoutImageURL;
        this.podcastAuthors = body.data[0].author;
        // showing podcast details when pressing enter to search

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
