// Vue file (component) = HTML (template) + JavaScript (script) + CSS (style)

<template>
  <Background/>
  <h1>{{ title }}</h1>
  <SearchBar/>
</template>

<script>
import Background from '/src/components/Background.vue'
import SearchBar from '/src/components/SearchBar.vue'

export default {
  name: 'App',
  components: {Background, SearchBar},
  data() {
    return {
      title: 'Vue Podcast App'
    }
  }
}
</script>


<style>
#app {
  font-family: Arial, Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  color: #fdfdfd;
  margin-top: 60px;
}
</style>

