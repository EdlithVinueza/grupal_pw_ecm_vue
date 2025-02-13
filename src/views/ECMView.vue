<!-- filepath: src/views/ECMView.vue -->
<template>
  <div>
    <button @click="goToInicio">Regresar</button>
    <h1>ECM</h1>
  </div>
</template>

<script>

export default {
  methods: {
    goToInicio() {
      this.$router.push({ name: 'Inicio' });
    },
  },
};
</script>