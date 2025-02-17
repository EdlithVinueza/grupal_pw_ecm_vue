import axios from 'axios';

const BASE_URL = 'http://localhost:8081/gestorcontenido/v1.1/archivos';

// Subir archivo
const subirArchivo = async (archivo, nombre, carpeta) => {
    const formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("nombre", nombre);
    formData.append("carpeta", carpeta); // Solo enviar el nombre de la carpeta

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
const listar = async (carpeta = '') => {
    const url = carpeta ? `${BASE_URL}/listar?carpeta=${encodeURIComponent(carpeta)}` : `${BASE_URL}/listar`;
    return axios.get(url).then(r => r.data);
};

// Listar archivos con nombres
const listarN = async () => {
    return axios.get(`${BASE_URL}/listarN`).then(r => r.data);
};

// Métodos fachada
export const subirArchivoFachada = async (formData) => {
    return await subirArchivo(formData.get("archivo"), formData.get("nombre"), formData.get("carpeta"));
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

export const listarFachada = async (carpeta) => {
    return await listar(carpeta);
};

export const listarNFachada = async () => {
    return await listarN();
};
