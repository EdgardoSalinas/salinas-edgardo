import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.json());

// Middleware para CORS
app.use(cors());

// Variable para almacenar las transacciones
let transacciones = [];


// Ruta default
app.get('/', (req, res) => {
    res.send('Servidor de transacciones: 3000/ingresos y Servidor de egresos: 3001/egresos');
  });
  

  
// Ruta para manejar la solicitud POST
app.post('/ingresos', (req, res) => {
  const { fecha, descripcion, monto, tipo, id } = req.body;

  // Guardar la transacción en la variable
  const transaccion = { fecha, descripcion, monto, tipo, id };
  transacciones.push(transaccion);

  // Enviar la respuesta
  res.status(201).json({ mensaje: 'Transacción guardada exitosamente' });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor de transacciones escuchando en http://localhost:${port}/ingresos  {
  "fecha": "2023-06-08",
  "descripcion": "Compra en supermercado",
  "monto": 50.75,
  "tipo": 2,
  "id": 1
}`);
});

export default transacciones;

