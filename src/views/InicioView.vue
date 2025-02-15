<template>
  <div>
    <Navbar />
  </div>
  <div class="container">
    <div class="container-buttons">
      <button class="buttons" @click="goToInicio">HOME</button>
      <button class="buttons" @click="goToECM">ECM</button>
    </div>
    <h1 class="title">Universidad Central del Ecuador</h1>
    <div class="image-container">
      <img :src="logoUCE" alt="No se visualiza la imagen">
      <img :src="logoCC" alt="No se visualiza la imagen">
    </div>
    <button class="button" @click="goToECM">ECM</button>
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
export default {
  components: {
    Navbar
  },
  name: 'InicioView',
  methods: {
    goToECM() {
      this.$router.push({ name: 'ECM' });
    },
    goToInicio() {
      this.$router.push({ name: 'Inicio' });
    }
  },
  computed: {
    logoUCE() {
      return require("@/assets/UCE.png");
    },
    logoCC() {
      return require("@/assets/CC.png");
    }

  }
};
</script>
<style>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.title {
  font-size: 2.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 20px;
}

.image-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

img {
  height: 500px;
  right: 39%;
  margin-left: 100px;
  margin-right: 100px;
}

.button {
  padding: 10px 20px;
  font-size: 1.2rem;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #2980b9;
}

.container-buttons {
  display: flex;
  gap: 20px;
}

.buttons {
  padding: 10px 15px;
  background: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.buttons:hover {
  background: #c0392b;
}
</style>