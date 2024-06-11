<template>
    <nav class="navbar">
        <h1 class="navbar-title">VueCaster Pro</h1>
        <ul class="navbar-list">
            <li class="navbar-item"><router-link class="router-link" to="/searchview">Search</router-link></li>
            <li class="navbar-item"><router-link class="router-link" to="/categoryview">Categories</router-link></li>
        </ul>
    </nav>
</template>

<style scoped>
.navbar {
    background-color: #333;
    color: #fff;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-title {
    margin-left: 20px;
}

.navbar-list {
    display: flex;
    list-style-type: none;
    justify-content: flex-end;
    align-items: center;
}

.navbar-item {
    margin-right: 50px;
    cursor: pointer;
}

.router-link {
    color: #fff;
    text-decoration: none;
}

</style>