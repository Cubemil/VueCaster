<template>
  <Background/>
  <h1>{{ title }}</h1>
  <SearchBar/>
</template>

<script>
import Background from '/src/components/Background.vue'
import SearchBar from '/src/components/SearchBar.vue'

export default {
  name: 'Homepage',
  components: {Background, SearchBar},
  data() {
    return {
      title: 'Vue Podcast App'
    }
  }
}
</script>

<style>

</style>