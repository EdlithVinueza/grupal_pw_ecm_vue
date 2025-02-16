<template>
  <div>
    <Navbar />
  </div>
  <div class="container text-center d-flex flex-column justify-content-center main-container">
    <h1 class="my-4 gradient-text">Universidad Central del Ecuador</h1>
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
  },
  mounted() {
    // Trigger the animation on mount
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
      logo.classList.add('flip');
      setTimeout(() => {
        logo.classList.remove('flip');
      }, 1000); // Duration of the animation
    });
  }
};
</script>

<style scoped>
.main-container {
  height: 90vh;
  margin-top: -3%; /* Ajusta este valor según sea necesario */
}

.gradient-text {
  background: linear-gradient(to right, blue, black);
  -webkit-background-clip: text;
  color: transparent;
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
  transition: transform 1s;
}

.logo.flip {
  transform: rotateY(360deg);
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