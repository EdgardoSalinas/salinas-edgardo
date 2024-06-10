import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
const port = 3000;
app.use(express.json({ limit: '500mb' })); // Aumenta el límite a 50MB

app.use(bodyParser.json());

// Middleware para CORS
app.use(cors());

let transacciones = [];

//ruta default
app.get('/', (req, res) => {
    res.send('Servidos apps 3000');
});


// ruta para registrar  los ingresos POST
app.post('/ingresos', (req, res) => {
    const { fecha, descripcion, monto } = req.body;
    const tipo = '1';
    // cantidad de elementos en la lista transacciones
    var id = transacciones.length;
    id = id + 1 ;
    const transaccion = { fecha, descripcion, monto, tipo, id};
    transacciones.push(transaccion);
    res.status(201).json({ mensaje: 'Transaccion ingreso guardada exitosamente'});

})



// ruta para obtener los ingresos GET
app.get('/ingresos', (req, res) => {
  // Filtrar las transacciones con tipo 1 (ingresos)
  const egresos = transacciones.filter(transaccion => transaccion.tipo === '1');
  // Enviar la respuesta
  res.json(egresos);
})


// ruta para registrar los egresos POST
app.post('/egresos', (req, res) => {
    const tipo='2';
    // cantidad de elementos en la lista transacciones
    var id = transacciones.length;
    id = id + 1 ;
    const { fecha, descripcion, monto } = req.body;
    const transaccion = { fecha, descripcion, monto, tipo, id};
    transacciones.push(transaccion);
    res.status(201).json({ mensaje: 'Transaccion egreso guardada exitosamente'});

})


// ruta para obtener los egresos GET
app.get('/egresos', (req, res) => {
    // Filtrar las transacciones con tipo 2 (egresos)
    const egresos = transacciones.filter(transaccion => transaccion.tipo === '2');
    // Enviar la respuesta
    res.json(egresos);
  })
  

  
// Ruta para obtener todas las transacciones get
app.get('/transacciones', (req, res) => {
    // Enviar la respuesta
    res.json(transacciones);
  });


  // Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor de egresos escuchando en http://localhost:${port}  DatosPrueba= {
                "fecha": "2023-06-08",
                "descripcion": "Compra en supermercado",
                "monto": 50.75
                }`);
  });
  