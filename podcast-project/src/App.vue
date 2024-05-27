// Vue file (component) = HTML (template) + JavaScript (script) + CSS (style)

<template>
  <div id="app">
    <Background/>
    <h1>{{ title }}</h1>
    <SearchBar/>
    <Categories/>
  </div>
</template>

<script>
import Background from './components/Background.vue'
import SearchBar from './components/SearchBar.vue'
import Categories from './components/Categories.vue'

export default {
  name: 'App',
  components: {Background, SearchBar, Categories},
  data() {
    return {
      title: 'Vue Podcast App'
    }
  }
}
</script>


<style>
#app {
  font-family: 'Montserrat', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /*color: #2c3e50;*/
  color: #fdfdfd;
  margin-top: 60px;
}
</style>

