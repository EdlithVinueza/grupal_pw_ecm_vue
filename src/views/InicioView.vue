<template>
  <div>
    <Navbar />
  </div>
  <div class="container text-center d-flex flex-column justify-content-center" style="height: 90vh;">
    <h1 class="my-4">Universidad Central del Ecuador</h1>
    <div class="d-flex flex-wrap justify-content-center">
      <img :src="logoUCE" alt="No se visualiza la imagen" class="img-fluid mx-3 my-2" style="max-width: 300px;">
      <img :src="logoCC" alt="No se visualiza la imagen" class="img-fluid mx-3 my-2" style="max-width: 300px;">
    </div>
    <button class="btn btn-primary mt-4 mx-auto" style="max-width: 200px;" @click="goToECM">Vamos al ECM</button>
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

<style>
</style>