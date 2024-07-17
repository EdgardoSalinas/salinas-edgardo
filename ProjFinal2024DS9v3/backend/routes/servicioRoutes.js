// backend/routes/serviceRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken');

const Service = require('../models/modelServicio');
const { authenticateToken, validateUserType, authAndValidateUserType } = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'llavesecreta';

// para photo
const multer = require('multer');
const path = require('path');
// Configuración de multer para manejar la subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/') // Asegúrate de que este directorio exista
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


// Crear un nuevo servicio
router.post('/servicios', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    console.log("service", req.body);
    for (let key in req.body) {
      console.log(`backend serviciosguardar: ${key} = ${req.body[key]}`);
    }
    

    const updateData = {
      tipoServicio: req.body.tipoServicio,
      usuarioproveedor: req.body.usuarioproveedor,
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      amenidades: req.body.amenidades,
      diasSemana: req.body.diasSemana,
      horarioDesde: req.body.horarioDesde,
      horarioHasta: req.body.horarioHasta,
      precioHora: req.body.precioHora,
      //imagenes: req.body.imagenes,
    };

    //      updateData.photoUrl = `../uploads/${req.file.filename}`;
    if (req.file) {
      console.log("reqfilename = ",req.file.filename);
      updateData.photoUrl = `../../uploads/${req.file.filename}`;
    }
    console.log(" ln57 serviciosguardar");



    //const service = new Service(req.body);
    const service = new Service(updateData);
    await service.save();
    res.status(201).send(service);
  } catch (error) {
    res.status(400).send(error);
  }
});

//router.get('/serviciosgetall', authenticateToken, async (req, res) => {
// Obtener todos los servicios
router.get('/serviciosgetall',  async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).send(services);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Obtener un servicio por ID
router.get('/servicios/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send();
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(error);
  }
});


// POST /api/ordenes/rate
router.post('/serviciorate', async (req, res) => {
  //{ numeroOrden: orderId, usuario: req.user.id },
    const { serviceId, rating } = req.body;
    try {
        const orden = await Service.findOneAndUpdate(
            { _id: serviceId },
            {
                calificacion: {
                    puntaje: rating,
                    fecha: new Date()
                }
            },
            { new: true }
        );
        if (!orden) {
            return res.status(404).json({ success: false, message: 'Servcio rate no encontrado' });
        }
     

        res.json({ success: true, message: 'Servicio calificado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al calificar el servicio' });
    }
});



// Actualizar un servicio por ID
router.put('/serviciosputxid/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) {
      return res.status(404).send();
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Eliminar un servicio por ID
router.delete('/servicios/:id', authenticateToken, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).send();
    }
    res.status(200).send(service);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
