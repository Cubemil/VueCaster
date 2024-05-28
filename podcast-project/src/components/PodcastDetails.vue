<template>
  <div class="podcastContainer">
    <div class="containerTitle">Top result</div>
    <div class="podcastCards">
      <div class="podcastCard">
        <img :src="url" id="podcastImage"/>
        <div id="podcastTitle">{{ podcastTitle }}</div>
        <div id="podcastAuthors">{{ podcastAuthors }}</div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'PodcastDetails',
  props: ['url', 'podcastTitle', 'podcastAuthors'] // receive podcast data
}
</script>

<style>
.containerTitle {
  color: #fdfdfd;
  text-align: start;
  font-weight: bold;
  font-size: 20px;
  padding-left: 12px;
}

.podcastContainer {
  background: #121212;
  width: fit-content;
  margin: auto;
  padding: 22px;
}

.podcastCards {
  display: flex;
  flex-wrap: wrap;
  background: rgb(18, 18, 18);
  width: fit-content;
  margin: auto;
  border-radius: 8px;
}

.podcastCard {
  border-radius: 8px;
  width: 375px;
  height: 190px;
  margin: 10px;
  background: rgb(24, 24, 24);
  text-align: left;
  padding: 20px;
}

#podcastImage {
  width: 100px;
  height: auto;
  box-shadow: #121212 0 0 10px;
  border-radius: 6px;
}

#podcastTitle {
  color: #fdfdfd;
  font-size: 30px;
  font-weight: bold;
  position: relative;
  top: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#podcastAuthors {
  color: #9b9b9b;
  font-size: 14px;
  position: relative;
  top: 35px;
}
</style>