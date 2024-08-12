<template>
<div id="top-bar-container">
	<div id="left-section">
		<i class="fas fa-ellipsis-h"></i>
	</div>
	<div id="right-section">
		<i class="fas fa-user-circle"></i>
	</div>
</div>
</template>

<script>
</script>

<style scoped>
#top-bar-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 1% 2%;
}

#left-section, #right-section {
	display: flex;
	align-items: center;
	color: #fdfdfd;
}

.fa-ellipsis-h, .fa-user-circle {
	font-size: 2em;
}

</style>
