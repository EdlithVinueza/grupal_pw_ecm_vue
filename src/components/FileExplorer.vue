<template>
  <div class="file-explorer-container">
    <h2 class="subtitle">{{ rutaActual }}</h2>

    <div class="d-flex justify-content-end">
      <button v-if="historial.length > 0 || nombreCarpetaSeleccionada !== 'Archivos'" class="btn btn-primary mb-3" @click="regresarCarpeta">
        <i class="bi bi-arrow-left text-white"></i> Volver
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
          <tr v-if="carpetas.length === 0 && archivos.length === 0">
            <td colspan="2">No existen archivos, por favor crea o agrega archivos.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="actions mb-3">
      <input type="text" v-model="nuevaCarpeta" placeholder="Nombre de carpeta" class="form-control">
      <button class="btn btn-primary" @click="agregarCarpeta">
        <i class="bi bi-plus-lg"></i> Agregar Carpeta
      </button>
    </div>

    <div class="actions">
      <input type="file" class="form-control-file" @change="seleccionarArchivo">
      <button class="btn btn-primary" @click="guardarArchivo" :disabled="!archivoSeleccionado">
        <i class="bi bi-floppy-fill"></i> Guardar Archivo
      </button>
    </div>
  </div>
</template>

<script>
import { getCarpetas, getArchivos, descargarArchivo, subirArchivo } from '../client/api';

export default {
  name: 'FileExplorer',
  props: {
    carpetaId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      carpetas: [],
      archivos: [],
      historial: [],
      nombreCarpetaSeleccionada: "Archivos",
      nuevaCarpeta: "",
      archivoSeleccionado: null,
    };
  },
  computed: {
    rutaActual() {
      const ruta = this.historial.map(carpeta => carpeta.nombre);
      if (this.nombreCarpetaSeleccionada !== "Archivos" && this.historial.length > 0) {
        ruta.push(this.nombreCarpetaSeleccionada);
      } else {
        return ['Archivos'].concat(ruta).join('');
      }
      return [].concat(ruta).join(' -> ');
    }
  },
  methods: {
    async fetchData() {
      try {
        const response = await getCarpetas(this.carpetaId);
        this.carpetas = response.data;
      } catch (error) {
        console.error("Error al obtener carpetas, usando mock:", error);
        this.carpetas = [
          { id: 1, nombre: "Documentos", tipo: "folder" },
          { id: 2, nombre: "Imágenes", tipo: "folder" },
          { id: 3, nombre: "Videos", tipo: "folder" }
        ];
      }
    },
    async cargarArchivos(carpeta) {
      this.historial.push({
        nombre: this.nombreCarpetaSeleccionada,
        carpetas: [...this.carpetas],
        archivos: [...this.archivos]
      });

      this.nombreCarpetaSeleccionada = carpeta.nombre;

      try {
        const response = await getArchivos(carpeta.id);
        this.archivos = response.data.archivos;
        this.carpetas = response.data.carpetas;
      } catch (error) {
        console.error("Error al obtener archivos, usando mock:", error);
        const mockData = this.generarMockArchivos(carpeta.nombre.toLowerCase());
        this.archivos = mockData.archivos;
        this.carpetas = mockData.carpetas;
      }
    },
    regresarCarpeta() {
      if (this.historial.length > 0) {
        const carpetaAnterior = this.historial.pop();
        this.nombreCarpetaSeleccionada = carpetaAnterior.nombre;
        this.carpetas = carpetaAnterior.carpetas;
        this.archivos = carpetaAnterior.archivos;
      } else {
        this.$emit('regresarCarpetaRaiz');
      }
    },
    agregarCarpeta() {
      if (!this.nuevaCarpeta.trim()) {
        alert("Ingrese un nombre para la carpeta.");
        return;
      }

      this.carpetas.push({
        id: Date.now(),
        nombre: this.nuevaCarpeta,
        tipo: "folder"
      });

      this.nuevaCarpeta = "";
    },
    seleccionarArchivo(event) {
      this.archivoSeleccionado = event.target.files[0];
    },
    async guardarArchivo() {
      if (!this.archivoSeleccionado) {
        alert("Seleccione un archivo.");
        return;
      }

      const formData = new FormData();
      formData.append("archivo", this.archivoSeleccionado);

      try {
        await subirArchivo(formData);
        alert("Archivo subido con éxito.");
      } catch (error) {
        console.error("Error al subir archivo:", error);
        alert("No se pudo subir el archivo.");
      }
      this.archivoSeleccionado = null;
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
        case 'pdf':
          return 'bi bi-file-pdf';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'bi bi-image-fill';
        case 'doc':
        case 'docx':
          return 'bi bi-file-earmark-word';
        case 'xls':
        case 'xlsx':
          return 'bi bi-file-earmark-x';
        default:
          return 'bi bi-file-earmark';
      }
    },
    archivoColor(archivo) {
      const extension = archivo.nombre.split('.').pop().toLowerCase();
      switch (extension) {
        case 'pdf':
          return 'red';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
          return 'purple';
        case 'doc':
        case 'docx':
          return 'blue';
        case 'xls':
        case 'xlsx':
          return 'green';
        default:
          return 'gray';
      }
    },
    generarMockArchivos(tipo) {
      const ejemplos = {
        root: {
          carpetas: [
            { id: 1, nombre: "Documentos", tipo: "folder" },
            { id: 2, nombre: "Imágenes", tipo: "folder" },
            { id: 3, nombre: "Videos", tipo: "folder" }
          ],
          archivos: [
            { id: 101, nombre: "resumen.txt" },
            { id: 102, nombre: "tareas.docx" }
          ]
        },
        documentos: {
          carpetas: [
            { id: 501, nombre: "mis talleres de web", tipo: "folder" }
          ],
          archivos: [
            { id: 502, nombre: "archivo1.txt" },
            { id: 503, nombre: "archivo2.docx" }
          ]
        },
        pdf: {
          carpetas: [],
          archivos: [
            { id: 201, nombre: "reporte_financiero.pdf" },
            { id: 202, nombre: "manual_usuario.pdf" }
          ]
        },
        imagenes: {
          carpetas: [
            { id: 303, nombre: "mis capturas de pantalla", tipo: "folder" }
          ],
          archivos: [
            { id: 301, nombre: "foto_vacaciones.jpg" },
            { id: 302, nombre: "logo_empresa.png" }
          ]
        },
        videos: {
          carpetas: [],
          archivos: [
            { id: 401, nombre: "presentacion.mp4" },
            { id: 402, nombre: "tutorial.mov" }
          ]
        }
      };

      return ejemplos[tipo] || { carpetas: [], archivos: [] };
    }
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style scoped>
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
  color: yellow;
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
</style>