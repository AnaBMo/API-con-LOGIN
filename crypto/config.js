const crypto = require('crypto');
const bcrypt = require('bcrypt');

const secret = crypto.randomBytes(64).toString('hex'); // genera la clave secreta aleatorio original
const hashedSecret = bcrypt.hashSync(secret, 10); // encripta la clave generada

module.exports = {
    hashedSecret, 
};

// console.log(secret);

/*
El secreto hasheado (hashedSecret) se utiliza para:
- Configurar la sesión en app.js.
- Firmar y verificar tokens JWT.
*/