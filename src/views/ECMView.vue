<template>
  <div>
    <Navbar />
  </div>
  <div class="mt-4 container">
    <h1 class="title">ECM</h1>
    <FileExplorer :carpetaId="carpetaId" />
  </div>
  <div>
    <Footer />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import FileExplorer from '../components/FileExplorer.vue';

export default {
  components: {
    Navbar,
    Footer,
    FileExplorer
  },
  data() {
    return {
      enArchivos: false,
      carpetaId: null
    };
  },
  methods: {
    entrarArchivos() {
      this.enArchivos = true;
    },
    regresarCarpetaRaiz() {
      this.enArchivos = false;
    },
  }
};
</script>

<style scoped>
.container {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
  text-align: center;
  color: rgb(0, 0, 82);
  font-weight: bold;
}

.table-responsive {
  width: 100%;
}

.icon-folder {
  color: yellow;
}

.file-name {
  cursor: pointer;
  text-decoration: none;
}

.file-name:hover {
  text-decoration: underline;
}
</style>