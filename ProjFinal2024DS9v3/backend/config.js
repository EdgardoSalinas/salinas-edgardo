// config.js

module.exports = {
    mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/your_database_name',
    API_BASE_URL: process.env.API_BASE_URL || '<http://localhost:3000>'

  };
  