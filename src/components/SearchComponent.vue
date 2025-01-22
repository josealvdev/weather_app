<template>
    <div class="search-box">
        <button class="btn-search"><img :src="searchIcon" class="fas fa-search"></img></button>
        <input type="text" class="input-search" placeholder="Busca tu ciudad...">
    </div>
</template>

<script setup>
import searchIcon from "./../assets/img/search-solid.svg";
</script>