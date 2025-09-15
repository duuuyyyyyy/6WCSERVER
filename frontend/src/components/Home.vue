<template>
  <div class="homepage">
    <h1>HOMEPAGE</h1>
    <div class="btn-container">
      <router-link to="/studentForm"><button>Student</button></router-link>
      <router-link to="/adminForm"><button>Admin</button></router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
}
</script>

<style scoped>
.homepage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

h1 {
  color: #303030;
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-transform: uppercase;
  text-shadow: 1px 1px 3px rgba(255, 255, 255, 0.6);
  font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
}

.btn-container {
  display: flex;
  gap: 1.5rem;
}

button {
  background-color: #303030;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #4a4a4a;
}
</style>