<script setup>
import StudentFormFetcher from './components/StudentFormFetch.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 flex items-center justify-center p-6">
    <StudentFormFetcher />
  </div>
</template>

<style scoped>
    body {
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        background: linear-gradient(135deg, #f5d0d0, #c47c7c);
        display: flex;
        flex-direction: column; 
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        margin: 0;
        padding: 20px;
        gap: 20px; 
    }
</style>
