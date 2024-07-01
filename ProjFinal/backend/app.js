const express = require('express');
const mongoose = require('mongoose');

const app = express();
const urlMongo = 'mongodb+srv://emsalinasl:utpds924@clusterdsix24.kzejgkh.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDSIX24'

// Connect to MongoDB
mongoose.connect(urlMongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Define routes and middleware here

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
