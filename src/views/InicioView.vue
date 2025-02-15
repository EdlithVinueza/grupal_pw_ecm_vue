<template>
  <div>
    <Navbar />
  </div>
  <div class="container text-center d-flex flex-column justify-content-center main-container">
    <h1 class="my-4">Universidad Central del Ecuador</h1>
    <div class="d-flex flex-wrap justify-content-center logos-container">
      <img :src="logoUCE" alt="No se visualiza la imagen" class="img-fluid mx-3 my-2 logo">
      <img :src="logoCC" alt="No se visualiza la imagen" class="img-fluid mx-3 my-2 logo">
    </div>
    <button class="btn btn-primary mt-4 mx-auto" @click="goToECM">Vamos al ECM</button>
  </div>
  <div>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';

export default {
  components: {
    Navbar,
    Footer
  },
  name: 'InicioView',
  computed: {
    logoUCE() {
      return require("@/assets/UCE.png");
    },
    logoCC() {
      return require("@/assets/CC.png");
    }
  },
  methods: {
    goToECM() {
      this.$router.push({ name: 'ECM' });
    }
  }
};
</script>

<style scoped>
.main-container {
  height: 80vh;
}

.logos-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.logo {
  max-width: 300px;
  width: 100%;
  height: auto;
}

button {
  max-width: 200px;
  width: 100%;
  
}

@media (max-width: 770px) {
  .main-container {
    height: 110vh;
  }
  button {
    max-width: 70%;
   
  }
 
}
@media (max-width: 500px) {
  .main-container {
    height: 110vh;
  }

  .logo {
    max-width: 200px;
  }

  button {
    max-width: 80%;
    margin-bottom: 20px; 
  }
}
</style>