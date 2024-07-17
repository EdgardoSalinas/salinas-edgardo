const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function validateUserType(allowedTypes) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (!allowedTypes.includes(req.user.type)) {
        return res.status(403).json({ message: 'Unauthorized user type' });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}

// Middleware combinado para autenticación y validación de tipo de usuario
function authAndValidateUserType(allowedTypes) {
  return [
    authenticateToken,
    validateUserType(allowedTypes)
  ];
}

module.exports = {
  authenticateToken,
  validateUserType,
  authAndValidateUserType
};

