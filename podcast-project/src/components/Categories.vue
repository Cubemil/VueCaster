<template>
  <div class="container">
    <div class="categoriesTitle">{{Categories}}</div>
    <div class="cards_container">
      <div class="card" style="background: rgb(13, 114, 235)" @click="getPodcastsInCategory(1)"><h2>Arts</h2></div>
      <div class="card" style="background: rgb(141,102,171)" @click="getPodcastsInCategory(4)"><h2>Food</h2></div>
      <div class="card" style="background: rgb(232,20,41)" @click="getPodcastsInCategory(5)"><h2>Literature</h2></div>
      <div class="card" style="background: rgb(39,132,106)" @click="getPodcastsInCategory(8)"><h2>Business</h2></div>
      <div class="card" style="background: rgb(224,51,0)" @click="getPodcastsInCategory(14)"><h2>Comedy</h2></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {}
  },
  methods: {
    async getPodcastsInCategory(id) {
      let url = new URL('https://api.fyyd.de/0.2/category/');
      const response = await fetch(url);

      // Check if the response was successful
      if (!response.ok) {
          throw new Error('HTTP error! Status: ${response.status}');
      }

      const body = await response.json();
      console.log("id", id);
      console.log("url", url);
      console.log("response", body);

      if (body.status !== 0) { 
          const podcasts = body.data.podcasts.map(podcast => ({
              id: podcast.id,
              title: podcast.title,
              author: podcast.author,
              image: podcast.layoutImageURL,
              url: podcast.url
          }));
          this.$emit('search-performed', podcasts);
      } else {
          console.error('API returned an error:', body.errors.message);
      }

    }
  }
}
</script>

<style>
.categoriesTitle {
  color: #fbfbfb;
  text-align: start;
  font-weight: bold;
  font-size: 20px;
  padding-left: 12px;
}

.container {
  background: #121212;
  width: fit-content;
  margin: auto;
  padding: 22px;
}

.cards_container {
  display: flex;
  flex-wrap: wrap;
  background: rgb(18, 18, 18);
  width: fit-content;
  margin: auto;
  border-radius: 8px;
}

.card {
  border-radius: 8px;
  width: 150px;
  height: 150px;
  margin: 10px;
}

.card h2 {
  margin-left: 14px;
  margin-right: 14px;
  text-align: left;
  font-size: 20px;
}
</style>

