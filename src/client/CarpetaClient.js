import axios from 'axios';

const BASE_URL = 'http://localhost:8081/gestorcontenido/v1.1/carpetas';

// Obtener todas las carpetas
const buscarTodosCarpeta = async () => {
    return axios.get(`${BASE_URL}`).then(r => r.data) || [];
};

// Guardar una nueva carpeta
const guardarCarpeta = async (carpeta) => {
    return axios.post(`${BASE_URL}`, carpeta).then(r => r.data);
};

const buscarCarpetasPorIdPadre = async (id) => {
    const url = `${BASE_URL}/porIdPadre?id=${id === null ? 'null' : id}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("Error al obtener las carpetas:", error);
        return [];
    }
};

export const buscarTodosCarpetaFachada = async () => {
    return await buscarTodosCarpeta();
};

export const guardarCarpetaFachada = async (carpeta) => {
    return await guardarCarpeta(carpeta);
};

export const buscarCarpetasPorIdPadreFachada = async (id) => {
    return await buscarCarpetasPorIdPadre(id);
};
