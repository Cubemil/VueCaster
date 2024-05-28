<template>
  <div>
    <Background/>
    <h1>{{ title }} </h1>
    <SearchBar/>
    <Categories/>
  </div>
</template>

<script>
import Background from './Background.vue'
import SearchBar from './SearchBar.vue'
import Categories from './Categories.vue'

export default {
  name: 'Home',
  components: {Background, SearchBar, Categories},
  data() {
    return {
      title: 'Vue Podcast App'
    }
  }
}
</script>

<style>
</style>
  