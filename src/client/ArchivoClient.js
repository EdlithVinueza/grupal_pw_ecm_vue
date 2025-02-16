import axios from 'axios';

const BASE_URL = 'http://localhost:8081/gestorcontenido/v1.1/archivos';

// Subir archivo
const subirArchivo = async (archivo, nombre, tipo) => {
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("nombre", nombre);
    formData.append("tipo", tipo);

    return axios.post(`${BASE_URL}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
};

// Obtener archivo por ID
const obtenerPorId = async (id) => {
    return axios.get(`${BASE_URL}/${id}`, { responseType: 'blob' }).then(r => r.data);
};

// Obtener archivo por nombre
const obtenerPorNombre = async (nombre) => {
    return axios.get(`${BASE_URL}/descargar?nombre=${encodeURIComponent(nombre)}`, { responseType: 'blob' }).then(r => r.data);
};

// Eliminar archivo por ID
const eliminarArchivo = async (id) => {
    return axios.delete(`${BASE_URL}/${id}`).then(r => r.data);
};

// Listar todos los archivos
const listar = async () => {
    return axios.get(`${BASE_URL}/listar`).then(r => r.data);
};

// Listar archivos con nombres
const listarN = async () => {
    return axios.get(`${BASE_URL}/listarN`).then(r => r.data);
};

// Métodos fachada
export const subirArchivoFachada = async (archivo, nombre, tipo) => {
    return await subirArchivo(archivo, nombre, tipo);
};

export const obtenerPorIdFachada = async (id) => {
    return await obtenerPorId(id);
};

export const obtenerPorNombreFachada = async (nombre) => {
    return await obtenerPorNombre(nombre);
};

export const eliminarArchivoFachada = async (id) => {
    return await eliminarArchivo(id);
};

export const listarFachada = async () => {
    return await listar();
};

export const listarNFachada = async () => {
    return await listarN();
};
