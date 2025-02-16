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

export const buscarTodosCarpetaFachada = async () => {
    return await buscarTodosCarpeta();
};

export const guardarCarpetaFachada = async (carpeta) => {
    return await guardarCarpeta(carpeta);
};

