<!-- filepath: src/components/FilePreview.vue -->
<template>
  <div v-if="archivo">
    <h3>Vista Previa: {{ archivo.nombre }}</h3>
    <!-- Aquí puedes agregar la lógica para mostrar la vista previa del archivo -->
  </div>
</template>

<script>
export default {
  name: 'FilePreview',
  props: {
    archivo: {
      type: Object,
      required: true,
    },
  },
};
</script>