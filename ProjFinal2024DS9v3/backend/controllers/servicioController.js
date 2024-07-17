const Service = require('../models/modelServicio');

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createService = async (req, res) => {
  const { tipoServicio, nombre, descripcion, amenidades, diasSemana, horarioDesde, horarioHasta, precioHora, imagenes } = req.body;

  try {
    const newService = new Service({ tipoServicio, nombre, descripcion, amenidades, diasSemana, horarioDesde, horarioHasta, precioHora, imagenes });
    await newService.save();
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
