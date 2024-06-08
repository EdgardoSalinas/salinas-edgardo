import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Middleware para CORS
app.use(cors());

// Variable para almacenar las transacciones (importada desde transacciones.js)
import transacciones from './transacciones.js';


// Ruta default
app.get('/', (req, res) => {
  res.send('Servidor de egresos: 3001/egresos Servidor de transaciones: 3000/transacciones');
});



// Ruta para obtener los egresos
app.get('/egresos', (req, res) => {
  // Filtrar las transacciones con tipo 2 (egresos)
  //const egresos = transacciones.filter(transaccion => transaccion.tipo === 2);
  // traer todas las transacciones
  const egresos = transacciones;
  // Enviar la respuesta
  res.json(egresos);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor de egresos escuchando en http://localhost:${port}`);
});
