// Vue file (component) = HTML (template) + JavaScript (script) + CSS (style)

<template>
  <Background/>
  <h1>{{ title }}</h1>
  <SearchBar/>

</template>

<script>
import SearchBar from './components/SearchBar.vue'
import Background from './components/Background.vue'

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
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  color: #fdfdfd;
  margin-top: 60px;
}
</style>

