import express from 'express';
import generateFibonacci from './fibonacci.js';

const app = express();
const port = 3000;

app.get('/fibonacci/', (req, res) => {
  const n = parseInt(req.query.n);

  if (isNaN(n) || n < 0) {
    return res.status(400).send('El parámetro "n" debe ser un número entero positivo.');
  }

  const fibonacci = generateFibonacci(n);
  res.json(fibonacci);
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port} ejemplo http://localhost:3000/fibonacci/?n=10`);
});
