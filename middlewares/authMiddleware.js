const jwt = require('jsonwebtoken'); // JWT: Se utiliza para generar y verificar tokens JWT.
const { hashedSecret } = require('../crypto/config');


//! Función para generar un token JWT utilizando la información del usuario.
function generateToken(user) {
    return jwt.sign({ user: user.id }, hashedSecret, { // almacenando el id del usuario dentro del token
      expiresIn: '1h',
    });
};  

//! Middleware que verifica la validez del token almacenado en la sesión.
function verifyToken(req, res, next) {
    const token = req.session.token;  // almacenamos en una variable el token de la sesión

    if (!token) {
        return res.status(401).json({ message: 'Sesión no activa. Token no proporcionado' }); //no autorizado
    }

    jwt.verify(token, hashedSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido', error: err.message });
        }
        req.user = decoded.user; // almacenamos el usuario decodificado en req
        next();
    });
};

module.exports = {
    generateToken,
    verifyToken
};