<template>
  <div class="container">
    <h1>Hier sollen die aktuell beliebtesten Podcasts angezeigt werden.</h1>
  </div>
</template>

<script setup>
</script>

<style scoped>
.container {
  position: fixed;
  top: 10px;
  left: 274px;
  width: calc(100% - 284px); /* 274px left margin + 10px right margin */
  height: calc(100% - 20px); /* 10px top + 10px bottom */
  padding-right: 10px;
  box-sizing: border-box; /* Include padding in the width calculation */
  overflow-y: auto; /* Allows scrolling if content overflows */
  border-radius: 10px;
}
</style>
