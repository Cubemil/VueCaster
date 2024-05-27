<template>
  <div class="container">
    <div class="title">Categories</div>
    <div class="cards_container">
      <div class="card" style="background: rgb(13, 114, 235)"><h2>Podcast-Charts</h2></div>
      <div class="card" style="background: rgb(141,102,171)"><h2>Neue Podcasts</h2></div>
      <div class="card" style="background: rgb(232,20,41)"><h2>Video-Podcasts</h2></div>
      <div class="card" style="background: rgb(39,132,106)"><h2>Nachrichten & Politik</h2></div>
      <div class="card" style="background: rgb(224,51,0)"><h2>True Crime</h2></div>
    </div>
  </div>
</template>

<style>
.title {
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
  padding: 20px;
}

.cards_container {
  display: flex;
  flex-wrap: wrap;
  background: rgb(18, 18, 18);
  width: fit-content;
  margin: auto;
  border-radius: 10px;
}

.card {
  border-radius: 10px;
  width: 160px;
  height: 160px;
  margin: 10px;
}

.card h2 {
  margin: 15px;
  padding-right: 50px;
  text-align: left;
  font-size: 18px;
}

</style>

<script>

import {defineComponent} from "vue";
import Categories from "@/App.vue";

export default defineComponent({
  components: {Categories}
})
</script>