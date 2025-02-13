<template>
  <div>
    <h1>Bienvenido</h1>
    <button @click="goToECM">ECM</button>
  </div>
</template>

<script>
export default {
  name: 'InicioView',
  methods: {
    goToECM() {
      this.$router.push({ name: 'ECM' });
    },
  },
};
</script>