const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const app = express();

const port = 3000;

app.use(morgan('dev'));

// Sirve archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname)));
console.log(__dirname);
// Datos de usuario de ejemplo
// const users = [
//     { username: 'usuario', password: 'contraseña' }
// ];

const users = [
    { username: 'juan', password: '123456', nombre: 'Juan', nombrecompleto: 'Juan Bosco', descripcion: 'Desarrollador Web', imagen: 'juan.jpg', pais: 'Panamá', email: 'juanz@gmail.com', celular: '507-6626438'  },
    { username: 'marta', password: '123456', nombre: 'Marta', nombrecompleto: 'Marta Salcedo',descripcion: 'Diseñadora Gráfica', imagen: 'marta.jpg', pais: 'Panamá', email: 'martax@gmail.com', celular: '507-6638711'  },
    // Agrega más usuarios según sea necesario
  ];

app.use(express.json());
app.use(session({
    secret: 'mi-secreto-de-sesion',
    resave: false,
    saveUninitialized: true
}));

/* app.get('/', (req, res) => {
    debugger;
    res.sendFile(path.join(__dirname, 'login.html'));
    //const filePath = path.join(__dirname, 'login.html');
    //console.log(filePath);
    //res.redirect(filePath);
    //res.redirect('/login.html');
    //res.redirect('/login.html');
  }); */

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.username = username;
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Nombre de usuario o contraseña incorrectos' });
    }
});


app.get('/login', (req, res) => {

    const usuarioAutenticado = users.find(u => u.username === req.session.username/* && u.password === password*/);
    if (usuarioAutenticado) {
        res.redirect('/profile');
    } else {
        res.redirect('/login.html');        
    }
    // ok res.redirect('/login.html');
    //const filePath = path.join(__dirname, 'login.html');
    //console.log(filePath);
    //res.redirect(filePath);
});

app.use('/profile', (req, res, next) => {
    if (req.session.username) {
        next();
    } else {
        res.redirect('/login.html');
    }
});

app.get('/profile', (req, res) => {

    const usuarioAutenticado = users.find(u => u.username === req.session.username/* && u.password === password*/);
    const { nombre, nombrecompleto, descripcion, imagen, pais, email, celular} = usuarioAutenticado;
    
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>profile</title>
            <link href="https://fonts.googleapis.com/css?family=Raleway|Ubuntu" rel="stylesheet">
            <link rel="stylesheet" href="css/estilop.css">
        </head>
        <body>
            <h1>Bienvenido, ${nombre}</h1>
            <p>Esta es tu página de profile.</p>
            
            <img src="${imagen}" alt="${nombre}" width="200" height="200">
            <h2>${nombrecompleto}</h2>
            <p>${email}</p>
            <p>${descripcion}</p>
            <p>Contacto:${celular}</p>
            <p>${pais}</p>
            <a href="/login"><button>Ir a Login</button></a>

        </body>
        </html>
    `);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    //res.redirect(path.join(__dirname, 'login.html'));
    res.redirect('/login.html');
});

// Ruta para limpiar la sesión
app.get('/limpiar-sesion', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error al limpiar la sesión:', err);
            res.status(500).send('Error al limpiar la sesión');
        } else {
            res.send('Sesión limpiada exitosamente');
        }
    });
});

//app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});