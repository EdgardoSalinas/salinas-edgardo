const User = require('../models/modelUser');
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');

// Secret key for JWT (store this securely, preferably in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'llavesecreta';

//const { authenticateToken, validateUserType, authAndValidateUserType } = require('./authMiddleware');

// para photo
const multer = require('multer');
const path = require('path');
// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../uploads/') // Asegúrate de que este directorio exista
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Añade la extensión original del archivo
  }
});
//const upload = multer({ storage: storage });
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Límite de tamaño de archivo (10MB)
    fieldSize: 200 * 1024 * 1024, // Límite de tamaño de campo (20MB)
  }
});
//

module.exports = {
  postRegister: async (req, res) => {
    try {
        const { contrasena, ...otherUserData } = req.body;
    
        // Check if the password is provided
        if (!contrasena) {
          return res.status(400).json({ message: 'Password is required' });
        }
    
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contrasena, saltRounds);
    
        // Create a new user with the hashed password
        const newUser = new User({
          ...otherUserData,
          contrasena: hashedPassword
        });
    
        // Save the user to the database
        await newUser.save();
    
        // Respond with success message (don't include the password in the response)
        res.status(201).json({ 
          message: 'User created successfully', 
          userId: newUser._id,
          usuario: newUser.usuario
        });
    
      } catch (error) {
        // Handle specific errors
        if (error.code === 11000) {
          // Duplicate key error (e.g., username or email already exists)
          return res.status(409).json({ message: 'User already exists' });
        }
    
        // Generic error handling
        console.error('Error registering user:', error);
        res.status(400).json({ message: 'Error creating user', error: error.message });
      }
    
  },
  postLogin: async (req, res) => {
    try {
      const { usuario, contrasena } = req.body;
      // console.log(usuario);
      // console.log(user);
  
      if (!usuario || !contrasena) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
  
      // Find the user by username
      const user = await User.findOne({ usuario });
  
      if (!user) {
        return res.json({ valid: false, message: 'Invalid username or password' });
      }
  
      // Compare the provided password with the stored hash
      const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
  
      if (isPasswordValid) {
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, username: user.usuario },
          JWT_SECRET,
          { expiresIn: '1h' } // Token expires in 1 hour
        );
        res.json({
          message: 'Login successful',
          token: token,
          userId: user._id,
          tipoUsuario: user.tipodeusuario,
          userName: user.usuario
        });
        //res.json({ valid: true, message: 'User credentials are valid' });
      } else {
        res.json({ valid: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      console.error('Error validating user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
 
  },
  getProfile: async (req, res ) => {
    console.log('Profile route hit', req.user);
    try {
      const user = await User.findById(req.user.userId).select('-contrasena');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  },


postProfileUpdate: async (req, res) => {
  try {
    const userId = req.user.userId; // Asumiendo que tu middleware de autenticación añade el userId al objeto req.user
    // enviar a console el body 
    console.log("Datos Recibido",req.body);

    const formData = new FormData();
    for (let key in req.body) {
      console.log(`backend Elemento agregado: ${key} = ${req.body[key]}`);
      formData.append(key, req.body[key]);
    }

    // Prepara los datos a actualizar
    const updateData = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      numerodecelular: req.body.numerodecelular,
      direccion1: req.body.direccion1,
      direccion2: req.body.direccion2,
      direccion3: req.body.direccion3,
      acercademi: req.body.acercademi,
      // cedula: req.body.cedula,
      // ruc: req.body.ruc,
      // placavehiculo: req.body.placavehiculo,
      // generalesdelvehiculo: req.body.generalesdelvehiculo,
      // referenciapersonalnombrecompleto: req.body.referenciapersonalnombrecompleto,
      // referenciapersonalcelular: req.body.referenciapersonalcelular
    };


    const nuevoFamiliar = {
      //photoUrl: String,
      nombrecompletofamiliar: req.body.nombrecompletofamiliar,
      cedulafamiliar: req.body.cedulafamiliar,
      edadfamiliar: req.body.edadfamiliar,
      direccion1familiar: req.body.direccion1familiar,
      direccion2familiar: req.body.direccion2familiar,
      direccion3familiar: req.body.direccion3familiar,
      emailfamiliar: req.body.emailfamiliar,
      celularfamiliar:  req.body.celularfamiliar,
      enfermedadesfamiliar:  req.body.enfermedadesfamiliar,
      acercadelfamiliar:  req.body.acercadelfamiliar
    }

    // se envia a la consola el contenido de updateData
    console.log("Datos del usuario a actualizar:", updateData);
    //console.log("Datos del nuevo familiar:", nuevoFamiliar);

    //      updateData.photoUrl = `../uploads/${req.file.filename}`;
    if (req.file) {
      updateData.photoUrl = `../../uploads/${req.file.filename}`;
    }
    console.log(" ln177 postProfileUpdate");

    const user = await User.findById(userId);

    if ( user.tipodeusuario == "proveedor") {
      updateData.cedula = req.body.cedula;
      updateData.ruc = req.body.ruc;
      updateData.placavehiculo = req.body.placavehiculo;
      updateData.generalesdelvehiculo = req.body.generalesdelvehiculo;
      updateData.referenciapersonalnombrecompleto = req.body.referenciapersonalnombrecompleto;
      updateData.referenciapersonalcelular = req.body.referenciapersonalcelular
    };


    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    console.log(" ln191 postProfileUpdate");
    console.log(" ln192 postProfileUpdate", user.tipodeusuario);
    console.log(" ln193 postProfileUpdate tipo de usuario", typeof user.tipodeusuario);
    const wtpuser = ( user.tipodeusuario == "usuario" );
    console.log(" ln195 postProfileUpdate", wtpuser) ;

    const familiarExistente = user.familiares.find(familiar => familiar.cedula === nuevoFamiliar.cedula);

    if (familiarExistente) {
      // Si el familiar existe, actualizarlo
      Object.assign(familiarExistente, nuevoFamiliar);
    } else {
      // Si el familiar no existe, agregarlo al array de familiares
      user.familiares.push(nuevoFamiliar);
    }
    console.log(" ln207 postProfileUpdate");

    console.log(" ln210 postProfileUpdate viene object assign ");
    // Actualizar los datos del usuario
    Object.assign(user, updateData);

    // Guardar los cambios en la base de datos
    const updatedUser = await user.save();
    console.log(" ln203 postProfileUpdate");

    //res.json({ message: 'Perfil actualizado con éxito', user: updatedUser });
    res.json({ message: 'Perfil actualizado con éxito' });
    console.log(" ln206 ultima postProfileUpdate", updatedUser);

  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil', error: error.message });
  }

}


}
