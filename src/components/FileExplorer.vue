<template>
  <div class="file-explorer-container">
    <h2 class="subtitle">{{ rutaActual }}</h2>

    <div class="d-flex justify-content-end gap-2">
      <button v-show="this.historial.length > 0" class="btn btn-primary mb-3" @click="regresarCarpeta">
        <i class="bi bi-arrow-left text-white"></i> Volver
      </button>
      <button :class="['btn', mostrarAgregarCapeta ? 'btn-danger' : 'btn-success', 'mb-3', 'mr-2']"
        @click="mostrarDivAgregar">
        <i :class="mostrarAgregarCapeta ? 'bi bi-x text-white' : 'bi bi-plus-lg text-white'"></i>
      </button>
      <button :class="['btn', mostrarSubirArchivo ? 'btn-danger' : 'btn-success', 'mb-3']" @click="mostrarDivSubir">
        <i :class="mostrarSubirArchivo ? 'bi bi-x text-white' : 'bi bi-cloud-upload text-white'"></i>
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Nombre</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="carpeta in carpetas" :key="carpeta.id" @click="cargarArchivos(carpeta)">
            <td class="highlight"><i class="bi bi-folder-fill icon-folder"></i> <span class="file-name">{{ carpeta.nombre }}</span></td>
          </tr>
          <tr v-for="archivo in archivos" :key="archivo.id">
            <td class="highlight d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i :class="archivoIcon(archivo)" :style="{ color: archivoColor(archivo) }"></i>
                <span class="file-name ml-2">{{ archivo.nombre }}</span>
              </div>
              <button class="btn btn-link" @click="descargar(archivo)" title="Descargar">
                <i class="bi bi-download"></i>
              </button>
            </td>
          </tr>

          <tr v-if="carpetas.length === 0 && archivos.length === 0 && enArchivos">
            <td colspan="2">No existen archivos o carpetas, por favor crea o agrega archivos.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <transition name="fade-slide">
      <div v-show="mostrarAgregarCapeta" class="actions">
        <input type="text" class="form-control-file" v-model="nuevaCarpeta" placeholder="Nombre de carpeta">
        <button class="btn btn-primary" @click="agregarCarpeta">
          <i class="bi bi-plus-lg"></i> Agregar Carpeta
        </button>
      </div>
    </transition>

    <transition name="fade-slide">
      <div v-show="mostrarSubirArchivo" class="actions">
        <input type="file" class="form-control-file" @change="seleccionarArchivo" ref="fileInput">
        <button class="btn btn-primary" @click="guardarArchivo" :disabled="!archivoSeleccionado">
          <i class="bi bi-floppy-fill"></i> Subir Archivo
        </button>
      </div>
    </transition>

  </div>
</template>

<script>
import { buscarTodosCarpetaFachada, guardarCarpetaFachada, buscarCarpetasPorIdPadreFachada } from "../client/CarpetaClient";
import { buscarArchivosPorIdCapetaFachada, subirArchivoFachada, obtenerPorIdFachada } from "../client/ArchivoClient";

export default {
  name: 'FileExplorer',
  data() {
    return {
      carpetas: [],
      archivos: [],
      historial: [],
      nombreCarpetaSeleccionada: "Archivos",
      nuevaCarpeta: "",
      carpetaActual: null,
      archivoSeleccionado: null,
      enArchivos: true,
      mostrarAgregarCapeta: false,
      mostrarSubirArchivo: false
    };
  },
  computed: {
    rutaActual() {
      const ruta = this.historial.map(carpeta => carpeta.nombre);
      if (this.nombreCarpetaSeleccionada !== "Archivos" && this.historial.length > 0) {
        ruta.push(this.nombreCarpetaSeleccionada);
      } else {
        return ['Archivos'].concat(ruta).join(' -> ');
      }
      return [].concat(ruta).join(' -> ');
    }
  },
  methods: {
    async fetchData() {
      try {
        const responseCarpetas = await buscarCarpetasPorIdPadreFachada(null);
        this.carpetas = responseCarpetas;
        const reponseArchivos = await buscarArchivosPorIdCapetaFachada(null);
        this.archivos = reponseArchivos;
      } catch (error) {
        console.error("Error al obtener carpetas, usando mock:", error);
        this.carpetas = []; 
        this.archivos = [];
      }
    },
    async cargarArchivos(carpeta) {
      this.historial.push({
        nombre: this.nombreCarpetaSeleccionada,
        carpetaAux: carpeta,
        carpetas: [...this.carpetas],
        archivos: [...this.archivos]
      });

      this.nombreCarpetaSeleccionada = carpeta.nombre;
      this.carpetaActual = carpeta;

      try {
        const data = await buscarCarpetasPorIdPadreFachada(carpeta.id);
        this.carpetas = data;

        const reponseArchivos = await buscarArchivosPorIdCapetaFachada(carpeta.id);
        this.archivos = reponseArchivos;

      } catch (error) {
        console.error("Error al obtener archivos, usando mock:", error);
        this.archivos = [];
        this.carpetas = [];
      }
    },

    regresarCarpeta() {
      if (this.historial.length > 0) {
        const carpetaAnterior = this.historial.pop();
        this.nombreCarpetaSeleccionada = carpetaAnterior.nombre;
        this.carpetas = carpetaAnterior.carpetas;
        this.archivos = carpetaAnterior.archivos;
        const carpetaAnteriorAux = this.historial[this.historial.length - 1]
        this.carpetaActual = carpetaAnteriorAux ? carpetaAnteriorAux.carpetaAux : null;
      } else {
        this.enArchivos = false;
        this.carpetas = [];
        this.archivos = [];
        this.carpetaActual = null;
      }
    },
    async agregarCarpeta() {
  if (!this.nuevaCarpeta.trim()) {
    alert("Ingrese un nombre para la carpeta.");
    return;
  }

  // Validar que no exista una carpeta con el mismo nombre
  const carpetaExistente = this.carpetas.some(carpeta => carpeta.nombre.toLowerCase() === this.nuevaCarpeta.toLowerCase());
  
  if (carpetaExistente) {
    alert(`Ya existe una carpeta con el nombre "${this.nuevaCarpeta}".`);
    return;
  }

  const nuevaCarpeta = {
    nombre: this.nuevaCarpeta,
    carpeta_padre_id: this.carpetaActual ? this.carpetaActual.id : null,
  };

  try {
    await guardarCarpetaFachada(nuevaCarpeta);
    if (this.carpetaActual) {
      const data = await buscarCarpetasPorIdPadreFachada(this.carpetaActual.id);
      this.carpetas = data;
    } else {
      const response = await buscarCarpetasPorIdPadreFachada(null);
      this.carpetas = response;
    }
    this.nuevaCarpeta = "";
  } catch (error) {
    console.error("Error al guardar la carpeta:", error);
  }
}
,
    seleccionarArchivo(event) {
      this.archivoSeleccionado = event.target.files[0];
    },
    mostrarDivAgregar() {
      this.mostrarAgregarCapeta = !this.mostrarAgregarCapeta;
    },
    mostrarDivSubir() {
      this.mostrarSubirArchivo = !this.mostrarSubirArchivo;
    },
    async guardarArchivo() {
  if (!this.archivoSeleccionado) {
    alert("Seleccione un archivo.");
    return;
  }

  const nombreArchivo = this.archivoSeleccionado.name;
  const archivoExistente = this.archivos.some(archivo => archivo.nombre === nombreArchivo);

  if (archivoExistente) {
    alert(`Ya existe un archivo con el nombre "${nombreArchivo}" en esta carpeta.`);
    return;
  }

  const formData = new FormData();
  formData.append("archivo", this.archivoSeleccionado);
  formData.append("nombre", nombreArchivo);
  formData.append("tipo", this.archivoSeleccionado.type);
  const carpetaId = this.carpetaActual ? this.carpetaActual.id : null;
  formData.append("carpetaId", carpetaId);

  try {
    await subirArchivoFachada(formData);

    if (this.carpetaActual) {
      const dataArchivo = await buscarArchivosPorIdCapetaFachada(this.carpetaActual.id);
      this.archivos = dataArchivo;
    } else {
      const reponseArchivos = await buscarArchivosPorIdCapetaFachada(null);
      this.archivos = reponseArchivos;
    }

    this.archivoSeleccionado = null;
    // Limpiar el input de archivo
    this.$refs.fileInput.value = '';
  } catch (error) {
    console.error("Error al subir archivo:", error);
    alert("No se pudo subir el archivo.");
  }
}
,

    async descargar(archivo) {
      try {
        const response = await obtenerPorIdFachada(archivo.id);
        const archivoBlob = new Blob([response], { type: response.type });
        const url = window.URL.createObjectURL(archivoBlob);
        const link = document.createElement("a");
        const filename = response.name || `${archivo.nombre}`;

        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error al descargar archivo:", error);
        alert("No se pudo descargar el archivo.");
      }
    },
    archivoIcon(archivo) {
      const extension = archivo.nombre.split('.').pop().toLowerCase();
      switch (extension) {
        case 'pdf': return 'bi bi-file-pdf';
        case 'jpg': case 'jpeg': case 'png': case 'gif': return 'bi bi-image-fill';
        case 'doc': case 'docx': return 'bi bi-file-earmark-word';
        case 'xls': case 'xlsx': return 'bi bi-file-earmark-x';
        default: return 'bi bi-file-earmark';
      }
    },
    archivoColor(archivo) {
      const extension = archivo.nombre.split('.').pop().toLowerCase();
      switch (extension) {
        case 'pdf': return 'red';
        case 'jpg': case 'jpeg': case 'png': case 'gif': return 'purple';
        case 'doc': case 'docx': return 'blue';
        case 'xls': case 'xlsx': return 'green';
        default: return 'gray';
      }
    }
  },
  mounted() {
    this.fetchData();
  },
};
</script>


<style scoped>
input {

  border: 1px solid #c4c4c4;
  border-radius: 5px;
}

.file-explorer-container {
  margin: 0 20px;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #555;
}

.table-responsive {
  width: 100%;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.actions input,
.actions button {
  flex: 1 1 auto;
  min-width: 200px;
}

.item {
  cursor: pointer;
  transition: transform 0.2s;
}

.item:hover {
  transform: scale(1.05);
}

.icon-folder {
  color: orange;
  /* Cambiado a naranja */
}

.icon-file {
  color: gray;
}

.icon-file-pdf {
  color: red;
}

.icon-file-word {
  color: blue;
}

.icon-file-excel {
  color: green;
}

.icon-image {
  color: purple;
}

.highlight {
  transition: background-color 0.3s;
}

.highlight:hover {
  background-color: #f0f0f0;
}

.file-name {
  cursor: pointer;
  text-decoration: none;
}

.file-name:hover {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .subtitle {
    font-size: 1rem;
  }

  .actions input,
  .actions button {
    flex: 1 1 100%;
  }

}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.fade-slide-enter,
.fade-slide-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

.fade-slide-enter-to,
.fade-slide-leave {
  transform: translateY(0);
  opacity: 1;
}
</style>