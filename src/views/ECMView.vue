<template>
  <div>
    <Navbar />
  </div>
  <div class="mt-4 container">
    <h1 class="title">ECM</h1>

    <div>
      <div v-if="!enArchivos">
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
              </tr>
            </thead>
            <tbody>
              <tr @click="entrarArchivos">
                <td><i class="bi bi-folder-fill icon-folder"></i> <span class="file-name">Carpeta Raiz</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
     
        <FileExplorer :carpetaId="carpetaId" />
      </div>
    </div>
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