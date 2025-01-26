const express = require('express');
const router = express.Router();
const { generateToken, verifyToken } = require('../middlewares/authMiddleware');
const { obtenerPersonajePorNombre } = require('../middlewares/apiPersonajes');
const { listaUsuarios } = require('../data/users');
    
//! GET /: Página de inicio. Devuelve un mensaje indicando si hay una sesión activa o no.
router.get('/', (req, res) => {
    if (req.session.token) {
        res.json({ message: 'Sesión activa. Puedes usar /search' }); // si existe el token, la sesión está iniciada
    } else {
        res.json({ message: 'Sesión no activa. Debes identificarte en /login' }); // como no hay token, debe identificarse y pasar por los middlewares de autenticación
    }
});

//! POST /login: Endpoint para autenticar y generar un token JWT.
router.post('/login', (req, res) => {
    const { username, password } = req.body; // recibe username y password del cuerpo de la solicitud
    const user = listaUsuarios.find((u) => u.username === username && u.password === password); // comprobar si está dentro de la lista de usuarios registrados

    console.log(req.body);

    if (user) {
        const token = generateToken(user); // generar token con caducidad para manejar la sesión
        req.session.token = token; // almacenar token en la sesión
        res.json({
            message: 'Inicio de sesión exitoso',
            redirect: '/search', 
            token,
        });
    } else {
        res.status(401).json({ message: 'Credenciales incorrectas' });
    }
});

//! GET /search: endpoint accesible solo con un token JWT válido.
router.get('/search', verifyToken, (req, res) => {
    res.json({
        message: 'Introduce el nombre del personaje en /character/:name para buscarlo.',
        example: '/character/Rick',
    });
});

//! GET /character/:name: endpoint accesible solo con un token JWT válido. Muestra personaje buscado.
router.get('/character/:name', verifyToken, async (req, res) => {
    const characterName = req.params.name; // recoge la información pasada por parámetro
    try {
        const character = await obtenerPersonajePorNombre(characterName); // llama a la función del middleware
        // si existe el personaje, devolverá el detalle del personaje en json
        if (character) {
            res.json({
                name: character.name,
                gender: character.gender,
                species: character.species,
                image: character.image,
            }); 
        } else {
            res.status(404).json({ message: 'Personaje no encontrado' }); 
        }
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el personaje', error: err.message });
    }
});

//! POST /logout: Endpoint para cerrar sesión y destruir la sesión.
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({
        message: 'Sesión cerrada exitosamente',
        redirect: '/',
    });
});


module.exports = router;



/*

{
  "username": "ana",
  "password": "ana"
}

*/

/*

{
    "name": "Rick Sanchez"
}

*/

