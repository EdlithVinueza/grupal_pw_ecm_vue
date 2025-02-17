<template>
  <div class="file-explorer-container">
    <h2 class="subtitle">{{ rutaActual }}</h2>

    <div class="d-flex justify-content-end gap-2">
      <button v-show="this.historial.length > 0" class="btn btn-primary mb-3" @click="regresarCarpeta">
        <i class="bi bi-arrow-left text-white"></i> Volver
      </button>
      <button :class="['btn', mostrarAgregarCapeta ? 'btn-danger' : 'btn-success', 'mb-3', 'mr-2']" @click="mostrarDivAgregar">
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
          <tr v-for="archivo in archivos" :key="archivo.id" @click="descargar(archivo.id)">
            <td class="highlight">
              <i :class="archivoIcon(archivo)" :style="{ color: archivoColor(archivo) }"></i> <span class="file-name">{{ archivo.nombre }}</span>
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
import { buscarTodosCarpetaFachada, guardarCarpetaFachada,buscarPorNombreFachada } from "../client/CarpetaClient";
import {subirArchivoFachada, descargarArchivo,listarFachada} from "../client/ArchivoClient";

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
  mounted() {
    this.fetchData();
  },
  computed: {
    rutaActual() {
      const ruta = this.historial.map(carpeta => carpeta.nombre);
      if (this.nombreCarpetaSeleccionada !== "Archivos" && this.historial.length > 0) {
        ruta.push(this.nombreCarpetaSeleccionada);
        console.log(this.nombreCarpetaSeleccionada)
        console.log(this.carpetaActual)
      } else {
        return ['Archivos'].concat(ruta).join(' -> ');
      }
      return [].concat(ruta).join(' -> ');
    }
  },
  methods: {
    async fetchData() {
      if (this.nombreCarpetaSeleccionada === "Archivos") {
        try {
          const data = await buscarTodosCarpetaFachada();
          if (Array.isArray(data)) {
            this.carpetas = data.filter(c => c.carpeta_padre_id === null);
            this.archivos = []; // No hay archivos en la raíz
          } else {
            console.error("La respuesta no es un array:", data);
            this.carpetas = [];
            this.archivos = [];
          }
        } catch (error) {
          console.error("Error al obtener carpetas y archivos:", error);
          this.carpetas = []; // Si hay error, se dejan las carpetas vacías
          this.archivos = []; // Si hay error, se dejan los archivos vacíos
        }
        return; // No realizar la búsqueda si la carpeta seleccionada es "Archivos"
      }
  
      try {
        const carpetaActual = await buscarPorNombreFachada(this.nombreCarpetaSeleccionada);
        this.carpetaActual = carpetaActual;
  
        const response = await listarFachada(this.nombreCarpetaSeleccionada);
        if (Array.isArray(response)) {
          this.carpetas = response.filter(item => item.carpeta && item.carpeta.id === this.carpetaActual.id);
          this.archivos = response.filter(item => !item.carpeta || item.carpeta.id === this.carpetaActual.id); // Filtrar solo los archivos
        } else {
          console.error("La respuesta no es un array:", response);
          this.carpetas = [];
          this.archivos = [];
        }
      } catch (error) {
        console.error("Error al obtener carpetas y archivos:", error);
        this.carpetas = []; // Si hay error, se dejan las carpetas vacías
        this.archivos = []; // Si hay error, se dejan los archivos vacíos
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
      console.log(this.historial);
      try {
        const data = await listarFachada(carpeta.nombre);
        if (Array.isArray(data)) {
          this.carpetas = data.filter(item => item.carpeta && item.carpeta.id === carpeta.id);
          this.archivos = data.filter(item => !item.carpeta || item.carpeta.id === carpeta.id); // Filtrar solo los archivos de la carpeta seleccionada
        } else if (carpeta.subcarpetas && Array.isArray(carpeta.subcarpetas)) {
          this.carpetas = carpeta.subcarpetas;
          this.archivos = []; // Ajusta esto según la estructura de tu respuesta si hay archivos
        } else {
          console.error("La respuesta no es un array ni contiene subcarpetas:", data);
          this.carpetas = [];
          this.archivos = [];
        }
      } catch (error) {
        console.error("Error al obtener archivos y carpetas:", error);
        this.archivos = []; // Si no hay respuesta del API, se deja vacío
        this.carpetas = []; // Lo mismo para las carpetas
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

      const nuevaCarpeta = {
        nombre: this.nuevaCarpeta,
        carpeta_padre_id: this.carpetaActual ? this.carpetaActual.id : null,
      };

      try {
        await guardarCarpetaFachada(nuevaCarpeta); // Guardas la carpeta en el backend
        await this.fetchData(); // Vuelve a cargar las carpetas después de agregar una nueva
        this.nuevaCarpeta = "";
      } catch (error) {
        console.error("Error al guardar la carpeta:", error);
      }
    },
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
  const formData = new FormData();
  
  formData.append("nombre", this.archivoSeleccionado.name.split('.')[0]);
  formData.append("archivo", this.archivoSeleccionado);
  formData.append("tipo", this.archivoSeleccionado.name.split('.').pop());
  console.log("Guardar en: "+this.nombreCarpetaSeleccionada)
  formData.append("carpeta", this.nombreCarpetaSeleccionada); // Solo enviar el nombre de la carpeta actual
  console.log(this.archivoSeleccionado)
  
  try {
    await subirArchivoFachada(formData);  // Llamada al API para subir el archivo
    alert("Archivo subido con éxito.");
    this.archivoSeleccionado = null;
    this.$refs.fileInput.value = ""; // Limpiar el campo de archivo seleccionado
  } catch (error) {
    console.error("Error al subir archivo:", error);
    alert("No se pudo subir el archivo.");
  }
},
    async descargar(archivoId) {
      try {
        const response = await descargarArchivo(archivoId);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "archivo_" + archivoId);
        document.body.appendChild(link);
        link.click();
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

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.fade-slide-enter, .fade-slide-leave-to {
  transform: translateY(-20px); 
  opacity: 0;
}

.fade-slide-enter-to, .fade-slide-leave {
  transform: translateY(0); 
  opacity: 1; 
}

</style>