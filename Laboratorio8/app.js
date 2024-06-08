import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3001;

// Middleware para analizar el cuerpo de la solicitud
app.use(bodyParser.json());

// Ruta para manejar la solicitud POST
app.post('/ingresos', (req, res) => {
  const { fecha, descripcion, monto, tipo, id } = req.body;

  // Guardar los datos en el localStorage
  const transaccion = { fecha, descripcion, monto, tipo, id };
  const transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
  transacciones.push(transaccion);
  localStorage.setItem('transacciones', JSON.stringify(transacciones));

  // Enviar la respuesta
  res.status(201).json({ mensaje: 'Transacción guardada exitosamente' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});