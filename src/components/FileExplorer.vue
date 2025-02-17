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
            <td class="highlight"><i class="bi bi-folder-fill icon-folder"></i> <span class="file-name">{{
              carpeta.nombre }}</span></td>
          </tr>
          <tr v-for="archivo in archivos" :key="archivo.id">
            <td class="highlight">
              <i :class="archivoIcon(archivo)" :style="{ color: archivoColor(archivo) }"></i> <span class="file-name">{{
                archivo.nombre }}</span>
            </td>
            <td>
        <button class="btn btn-outline-primary btn-sm" @click="descargar(archivo.id)">
          <i class="bi bi-download"></i> Descargar
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
        <input type="file" class="form-control-file" @change="seleccionarArchivo">
        <button class="btn btn-primary" @click="guardarArchivo" :disabled="!archivoSeleccionado">
          <i class="bi bi-floppy-fill"></i> Subir Archivo
        </button>
      </div>
    </transition>

  </div>
</template>


<script>
import { buscarTodosCarpetaFachada, guardarCarpetaFachada } from "../client/CarpetaClient";
import { subirArchivoFachada, listarFachada, listarNFachada } from "../client/ArchivoClient";
import { descargarArchivo, getArchivos } from "../client/api";
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
        const response = await buscarTodosCarpetaFachada();
        this.carpetas = response.filter(carpeta => carpeta.carpeta_padre_id === null);
       this.archivos = []; // Inicialmente, no hay archivos
        //const archivosResponse = await listarFachada();
        //if (this.carpetaSeleccionada) {
         // this.archivos = archivosResponse.filter(archivo =>
           // archivo.arch_id !== null && archivo.carp_id === this.carpetaSeleccionada.id
         //);
        //} else {
       //   this.archivos = []; // Si no hay carpeta seleccionada, no mostrar archivos
       // }
      } catch (error) {
        console.error("Error al obtener carpetas, usando mock:", error);
        this.carpetas = []; // Si hay error, se dejan las carpetas vacías
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
        //const response = await getArchivos(carpeta.nombre);
        //this.archivos = response.data.archivos; // Carga los archivos de la carpeta seleccionada
        const data = await buscarTodosCarpetaFachada();
        this.carpetas = data.filter(c => c.carpeta_padre_id === carpeta.id);
        this.archivos = await listarFachada();
        console.log("Archivos cargados:", this.archivos);
      } catch (error) {
        console.error("Error al obtener archivos, usando mock:", error);
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
        const data = await buscarTodosCarpetaFachada();
        if (this.carpetaActual) {
          this.carpetas = data.filter(c => c.carpeta_padre_id === this.carpetaActual.id);
        } else {
          this.carpetas = data.filter(c => c.carpeta_padre_id === null);
        }
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

      const nombre = this.archivoSeleccionado.name; // Nombre del archivo
      const tipo = this.archivoSeleccionado.type; // Tipo MIME del archivo
      const carpetaId = this.carpetaActual ? this.carpetaActual.id : null; // Obtener ID de la carpeta
      console.log(carpetaId);
      if (!carpetaId) {
        alert("La carpeta seleccionada no existe.");
        return;
      }

      try {
        await subirArchivoFachada(this.archivoSeleccionado, nombre, tipo, carpetaId); // Pasar los tres parámetros
        alert("Archivo subido con éxito.");


        this.archivoSeleccionado = null;
        this.mostrarSubirArchivo = false;
        //this.fetchData(); // Recargar la lista de archivos
        if (this.carpetaActual) {
          await this.cargarArchivos(this.carpetaActual); // Recargar la carpeta actual
        } else {
          await this.fetchData(); // Recargar la lista principal si no hay carpeta seleccionada
        }
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


.table th,
.table td {
  border: none !important; /* Quita las líneas de las celdas */
  padding: 10px; /* Espacio entre los elementos */
}

.table thead {
  background-color: transparent; /* Fondo transparente en los encabezados */
  font-weight: bold;
}

/* Agregar espacio entre filas */
.table tbody tr {
  border-bottom: 1px solid transparent !important; /* Evita líneas de separación */
}

/* Opcional: efecto hover para filas */
.table tbody tr:hover {
  background-color: rgba(0, 0, 0, 0.05); /* Leve sombreado al pasar el mouse */
}
</style>