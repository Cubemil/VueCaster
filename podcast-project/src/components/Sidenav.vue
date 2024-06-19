<template>
    <nav class="sidenav">
        <h1 class="sidenav-title">VueCaster Pro</h1>
        <ul class="sidenav-list">
            <li class="sidenav-item"><router-link class="router-link" to="/searchview">Search</router-link></li>
            <li class="sidenav-item"><router-link class="router-link" to="/categoryview">Categories</router-link></li>
        </ul>
    </nav>
</template>

<style scoped>
.sidenav {
    background-color: #333;
    color: #fff;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sidenav-title {
    margin-left: 20px;
}

.sidenav-list {
    display: flex;
    list-style-type: none;
    justify-content: flex-end;
    align-items: center;
}

.sidenav-item {
    margin-right: 50px;
    cursor: pointer;
}

.router-link {
    color: #fff;
    text-decoration: none;
}
</style>