<!-- filepath: src/components/FileExplorer.vue -->
<template>
  <div>
    <h2>Carpeta: {{ carpetaId }}</h2>
    <ul>
      <li v-for="carpeta in carpetas" :key="carpeta.id" @click="navigateToCarpeta(carpeta.id)">
        {{ carpeta.nombre }}
      </li>
      <li v-for="archivo in archivos" :key="archivo.id">
        {{ archivo.nombre }}
        <button @click="descargarArchivo(archivo.id)">Descargar</button>
        <button @click="vistaPreviaArchivo(archivo)">Vista Previa</button>
      </li>
    </ul>
    <button @click="goBack">Regresar</button>
    <FilePreview v-if="archivoSeleccionado" :archivo="archivoSeleccionado" />
  </div>
</template>

<script>
import { getCarpetas, getArchivos, descargarArchivo } from '../client/api';
import FilePreview from './FilePreview.vue';

export default {
  name: 'FileExplorer',
  components: {
    FilePreview,
  },
  props: {
    carpetaId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      carpetas: [],
      archivos: [],
      archivoSeleccionado: null,
    };
  },
  methods: {
    async fetchData() {
      this.carpetas = await getCarpetas(this.carpetaId);
      this.archivos = await getArchivos(this.carpetaId);
    },
    navigateToCarpeta(carpetaId) {
      this.$router.push({ name: 'ECM', params: { carpetaId } });
    },
    descargarArchivo(archivoId) {
      descargarArchivo(archivoId);
    },
    vistaPreviaArchivo(archivo) {
      this.archivoSeleccionado = archivo;
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>