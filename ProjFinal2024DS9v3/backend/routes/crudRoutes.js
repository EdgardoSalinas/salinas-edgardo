const express = require('express');
const router = express.Router();
const OrdenServicio = require('../models/modelOrdenes');
const Service = require('../models/modelServicio');
const User = require('../models/modelUser');

const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');
const { authenticateToken, validateUserType, authAndValidateUserType } = require('../middleware/authMiddleware');

const userController = require('../controllers/userController');
//const { validateUserType } = require('./authMiddleware');

const multer = require('multer');
const path = require('path');

// Secret key for JWT (store this securely, preferably in an environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'llavesecreta';


// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/') // Asegúrate de que este directorio exista
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Añade la extensión original del archivo
  }
});

const upload = multer({ storage: storage });
//const upload = multer({ dest: 'uploads/' }); // Guarda los archivos en el director

// OrdenServicio routes
router.post('/api/ordenes', async (req, res) => {
    try {
        const orden = new OrdenServicio(req.body);
        await orden.save();
        res.status(201).json(orden);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/api/ordenes', async (req, res) => {
    try {
        const ordenes = await OrdenServicio.find();
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/api/ordenes/:id', async (req, res) => {
    try {
        const orden = await OrdenServicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(orden);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/api/ordenes/:id', async (req, res) => {
    try {
        await OrdenServicio.findByIdAndDelete(req.params.id);
        res.json({ message: 'Orden deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Service routes
router.post('/api/servicios', async (req, res) => {
    try {
        const servicio = new Service(req.body);
        await servicio.save();
        res.status(201).json(servicio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/api/servicios', async (req, res) => {
    try {
        const servicios = await Service.find();
        res.json(servicios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/api/servicios/:id', async (req, res) => {
    try {
        const servicio = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(servicio);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/api/servicios/:id', async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Servicio deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User routes
router.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/api/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/api/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;

