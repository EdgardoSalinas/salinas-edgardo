const express = require('express');
const router = express.Router();
const OrdenServicio = require('../models/modelOrdenes'); // Asegúrate de que la ruta sea correcta

// POST /api/orden-servicio
router.post('/addorden', async (req, res) => {
  try {
    // Extraer los datos del cuerpo de la solicitud
    const {
      numeroOrden,
      usuario,
      idDelServicio,
      usuarioDelProveedor,
      estado,
      calificacion,
      detalles,
      citasDelServicio,
      cantidad,
      precio,
      monto,
      descripcion
    } = req.body;

    // Crear una nueva instancia de OrdenServicio
    const nuevaOrden = new OrdenServicio({
      numeroOrden,
      usuario,
      idDelServicio,
      usuarioDelProveedor,
      estado,
      calificacion,
      detalles,
      citasDelServicio,
      cantidad,
      precio,
      monto,
      descripcion
    });

    console.log("datos en api addorden ", nuevaOrden)
    // Guardar la nueva orden en la base de datos
    const ordenGuardada = await nuevaOrden.save();

    // Responder con la orden guardada
    res.status(201).json(ordenGuardada);
  } catch (error) {
    // Si hay un error, verificar si es un error de validación
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    // Para otros tipos de errores
    res.status(500).json({ message: 'Error al crear la orden de servicio', error: error.message });
  }
});



router.get('/getordenes', async (req, res) => {
  try {
    const { page = 1, limit = 10, estado, usuario } = req.query;

    const query = {};
    if (estado) query.estado = estado;
    if (usuario) query.usuario = usuario;

    const ordenes = await OrdenServicio.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ fechaCreacion: -1 })
      .exec();

    const count = await OrdenServicio.countDocuments(query);

    res.status(200).json({
      ordenes,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las órdenes de servicio', error: error.message });
  }
});

router.post('/updateStatus', async (req, res) => {
  const { orderId, newStatus } = req.body;
  try {
    // Aquí debes implementar la lógica para actualizar el estado de la orden en tu base de datos
    // Por ejem
    // update el status de la orden por el campo numeroOrden
    const respuesta = await OrdenServicio.findOneAndUpdate({ numeroOrden: orderId }, { estado: newStatus });

    //const respuesta = await OrdenServicio.findByIdAndUpdate(orderId, { estado: newStatus });
    res.json({ success: true, message: 'Estado de la orden actualizado' });

  } catch (error) {
    console.error('Error al actualizar el estado de la orden:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar el estado de la orden' });
  }
});


// vista de ordenes

// const express = require('express');
// const router = express.Router();
// const OrdenServicio = require('../models/modelOrdenes');

// GET /api/ordenes/miordenes
// no funciona
router.get('/miordenes', async (req, res) => {
    try {
        // Asume que el ID del usuario está en req.user.id (requiere autenticación)
        //const ordenes = await OrdenServicio.find({ usuario: req.user.id }).sort({ fechaCreacion: -1 });
        console.log("usuario", req.usuario);
        const ordenes = await OrdenServicio.find({ usuario: req.usuario }).sort({ fechaCreacion: -1 });
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las órdenes', error: error.message });
    }
});

// POST /api/ordenes/updateStatus
router.post('/updateStatusV2', async (req, res) => {
    const { orderId, newStatus } = req.body;
    try {
        const orden = await OrdenServicio.findOneAndUpdate(
            { numeroOrden: orderId, usuario: req.user.id },
            { estado: newStatus },
            { new: true }
        );
        if (!orden) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }
        res.json({ success: true, message: 'Estado de la orden actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar el estado de la orden' });
    }
});

// POST /api/ordenes/rate
router.post('/rate', async (req, res) => {
  //{ numeroOrden: orderId, usuario: req.user.id },
    const { orderId, rating } = req.body;
    try {
        const orden = await OrdenServicio.findOneAndUpdate(
            { numeroOrden: orderId },
            {
                calificacion: {
                    puntaje: rating,
                    fecha: new Date()
                }
            },
            { new: true }
        );
        if (!orden) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }
      

        res.json({ success: true, message: 'Orden calificada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al calificar la orden' });
    }
});



module.exports = router;