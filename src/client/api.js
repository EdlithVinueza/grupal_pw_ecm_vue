import axios from "axios";

const API_URL = "http://localhost:8080/gestorcontenido/v1.1";

// Obtener lista de carpetas
const getCarpetas = () => axios.get(`${API_URL}/carpetas`);

// Obtener archivos de una carpeta específica
const getArchivos = (carpetaId) =>
  axios.get(`${API_URL}/archivos/listar?carpeta=${carpetaId}`);

// Subir archivo
const subirArchivo = (formData) =>
  axios.post(`${API_URL}/archivos`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Descargar archivo
const descargarArchivo = (archivoId) =>
  axios.get(`${API_URL}/archivos/${archivoId}`, { responseType: "blob" });

export default{
    getCarpetas,
    getArchivos,
    subirArchivo,
    descargarArchivo,
}
