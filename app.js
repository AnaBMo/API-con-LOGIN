const express = require('express'); // Express: Se importa y se configura para crear el servidor web.
const session = require('express-session'); // Se utiliza para manejar sesiones en Express.
const router = require('./routes/routes');
const { hashedSecret } = require('./crypto/config');

const app = express();
const PORT = 3001;

// Middleware para manejar datos de formulario y JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de sesión con un secreto generado con crypto y bcrypt para manejar sesiones de usuario.
app.use(
    session({
        secret: hashedSecret, // clave secreta para generar el token
        resave: false, // no guardar cambios en la sesión siempre, solo cuando se realice algún cambio
        saveUninitialized: true, // se guarda la inicialización de la sesión
        cookie: { secure: false }, // guarda información de la sesión activa, cambia a 'true' si estás utilizando HTTPS
    })
);

app.use('/', router);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal');
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});