<template>
  <div>
    <Navbar />
  </div>
  <div class="container">
    <div class="container-buttons">
      <button class="buttons" @click="goToInicio">HOME</button>
      <button class="buttons" @click="goToECM">ECM</button>
    </div>

    <h1 class="title">ECM</h1>

    <div v-if="!enArchivos">
      <button class="enter-folder-button" @click="entrarArchivos">📁 Ingresar a Archivos</button>
    </div>

    <div v-else>
      <h2 class="subtitle">{{ nombreCarpetaSeleccionada }}</h2>

      <button v-if="historial.length > 0" class="back-folder" @click="regresarCarpeta">
        ⬅ Volver
      </button>

      <div class="list-container">
        <ul class="folder-list">
          <li v-for="carpeta in carpetas" :key="carpeta.id" @dblclick="cargarArchivos(carpeta)">
            📁 {{ carpeta.nombre }}
          </li>
        </ul>
        <ul class="file-list">
          <li v-for="archivo in archivos" :key="archivo.id">
            📄 {{ archivo.nombre }}
            <button class="download-button" @click="descargar(archivo.id)">Descargar</button>
          </li>
        </ul>
      </div>

      <div class="actions">
        <input type="text" v-model="nuevaCarpeta" placeholder="Nombre de carpeta" class="input">
        <button class="add-folder-button" @click="agregarCarpeta">➕ Agregar Carpeta</button>
      </div>

      <div class="actions">
        <input type="file" class="file-input" @change="seleccionarArchivo">
        <button class="save-file-button" @click="guardarArchivo" :disabled="!archivoSeleccionado">
          💾 Guardar Archivo
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "../client/api"; // Importa la API
import Navbar from '../components/Navbar.vue';

export default {
  components: {
    Navbar
  },
  data() {
    return {
      enArchivos: false,
      carpetas: [],
      archivos: [],
      historial: [],
      nombreCarpetaSeleccionada: "",
      nuevaCarpeta: "",
      archivoSeleccionado: null
    };
  },
  methods: {
    goToInicio() {
      this.$router.push({ name: "Inicio" });
    },
    goToECM() {
      this.$router.push({ name: "ECM" });
    },
    async entrarArchivos() {
      this.enArchivos = true;
      this.nombreCarpetaSeleccionada = "Archivos";
      try {
        const response = await api.getCarpetas();
        this.carpetas = response.data;
      } catch (error) {
        console.error("Error al obtener carpetas, usando mock:", error);
        this.carpetas = [
          { id: 1, nombre: "Documentos", tipo: "pdf" },
          { id: 2, nombre: "Imágenes", tipo: "img" },
          { id: 3, nombre: "Videos", tipo: "video" }
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
        const response = await api.getArchivos(carpeta.id);
        this.archivos = response.data;
      } catch (error) {
        console.error("Error al obtener archivos, usando mock:", error);
        this.archivos = this.generarMockArchivos(carpeta.tipo);
      }
    },
    regresarCarpeta() {
      if (this.historial.length > 0) {
        const carpetaAnterior = this.historial.pop();
        this.nombreCarpetaSeleccionada = carpetaAnterior.nombre;
        this.carpetas = carpetaAnterior.carpetas;
        this.archivos = carpetaAnterior.archivos;
      } else {
        this.enArchivos = false;
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
        subcarpetas: []
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
        await api.subirArchivo(formData);
        alert("Archivo subido con éxito.");
      } catch (error) {
        console.error("Error al subir archivo:", error);
        alert("No se pudo subir el archivo.");
      }
      this.archivoSeleccionado = null;
    },
    async descargar(archivoId) {
      try {
        const response = await api.descargarArchivo(archivoId);
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
    generarMockArchivos(tipo) {
      const ejemplos = {
        root: [
          { id: 101, nombre: "resumen.txt" },
          { id: 102, nombre: "tareas.docx" }
        ],
        pdf: [
          { id: 201, nombre: "reporte_financiero.pdf" },
          { id: 202, nombre: "manual_usuario.pdf" }
        ],
        img: [
          { id: 301, nombre: "foto_vacaciones.jpg" },
          { id: 302, nombre: "logo_empresa.png" }
        ],
        video: [
          { id: 401, nombre: "presentacion.mp4" },
          { id: 402, nombre: "tutorial.mov" }
        ]
      };

      return ejemplos[tipo] || [];
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
  padding: 20px;
}

.title {
  font-size: 2rem;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #555;
}

.list-container {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.folder-list,
.file-list {
  list-style: none;
  padding: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
}

.folder-list li,
.file-list li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s;
}

.folder-list li:hover,
.file-list li:hover {
  background: #e0e0e0;
}

.download-button {
  margin-left: 10px;
  padding: 5px 10px;
  background: #3498db;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.download-button:hover {
  background: #2980b9;
}

.buttons {
  padding: 10px 15px;
  background: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.buttons:hover {
  background: #c0392b;
}

.enter-folder-button {
  padding: 10px 15px;
  background: #2980b9;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.enter-folder-button:hover {
  background: #21618c;
}

.back-folder {
  margin-bottom: 15px;
  padding: 10px 15px;
  background: #2ecc71;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.back-folder:hover {
  background: #27ae60;
}

.container-buttons {
  display: flex;
  gap: 20px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.input,
.file-input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.save-file-button {
  padding: 8px 12px;
  background: #f39c12;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.save-file-button:hover {
  background: #e67e22;
}
</style>