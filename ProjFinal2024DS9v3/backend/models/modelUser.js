// In your user model file (e.g., models/User.js)
const mongoose = require('mongoose');

const familiarSchema = new mongoose.Schema({
  photoUrlfamiliar: String,
  nombrecompletofamiliar: String,
  cedulafamiliar: String,
  edadfamiliar: Number,
  direccion1familiar: String,
  direccion2familiar: String,
  direccion3familiar: String,
  emailfamiliar: String,
  celularfamiliar: String,
  enfermedadesfamiliar: String,
  acercadelfamiliar: String
});

const userSchema = new mongoose.Schema({
  usuario: { type: String, required: true, unique: true },
  tipodeusuario: {
    type: String,
    enum: ['usuario', 'proveedor'],
    default: 'usuario'
  },
  photoUrl: String,
  nombre: String,
  apellido: String,
  email: { type: String, required: true, unique: true },
  contrasena: String,
  numerodecelular: String,
  direccion1: String,
  direccion2: String,
  direccion3: String,
  acercademi: String,
  // Array de familiares
  familiares: [familiarSchema],
 
  // para proveedor
  cedula: String,
  ruc: String,
  placavehiculo: String,
  generalesdelvehiculo: String,
  referenciapersonalnombrecompleto: String,
  referenciapersonalcelular: String,
  fechaRegistro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);