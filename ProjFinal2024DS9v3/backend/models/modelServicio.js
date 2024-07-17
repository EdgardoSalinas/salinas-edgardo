const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    tipoServicio: {
        type: String,
        required: true,
    },
    usuarioproveedor: String,
    nombre: {
        type: String,
        required: true,
    },
    descripcion: {
        type: String,
        required: true,
    },
    amenidades: {
        type: String,
        required: true,
    },
    diasSemana: {
        type: [String],
        required: true,
    },
    horarioDesde: {
        type: String,
        required: true,
    },
    horarioHasta: {
        type: String,
        required: true,
    },
    precioHora: {
        type: Number,
        required: true,
    },
    imagenes: {
        type: [String],
        required: true,
    },
    photoUrl: String,
    calificacion: { 
        puntaje: { 
          type: Number, 
          min: 1, 
          max: 5 
        },
        comentario: String, 
        fecha: Date 
      },
});

module.exports = mongoose.model('Service', ServiceSchema);
