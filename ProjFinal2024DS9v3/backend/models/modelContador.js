// models/contador.model.js
const mongoose = require('mongoose');

const ContadorSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const Contador = mongoose.model('Contador', ContadorSchema);

async function getNextSequence(name) {
    const counter = await Contador.findByIdAndUpdate(
        name,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

module.exports = { Contador, getNextSequence };