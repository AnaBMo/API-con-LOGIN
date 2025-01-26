const axios = require('axios');

// Esta función devuelve todos los personajes disponibles en la API de Rick and Morty.
const obtenerPersonajesApi = async () => {
    try {
        const response = await axios.get('https://rickandmortyapi.com/api/character');
        return response.data.results;
    } catch (error) {
        console.error('Error en la obtención de personajes:', error.message);
        throw new Error('Error en la obtención de personajes');
    }
};

// Esta función devuelve el personaje cuyo nombre le hayamos indicado.
const obtenerPersonajePorNombre = async (name) => {
    try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character/?name=${name}`);
        return response.data.results[0]; // Devuelve el primer personaje encontrado o undefined
    } catch (error) {
        console.error('Error al obtener el personaje:', error.message);
        throw new Error('Error al obtener el personaje');
    }
};

module.exports = {
    obtenerPersonajesApi,
    obtenerPersonajePorNombre,
};