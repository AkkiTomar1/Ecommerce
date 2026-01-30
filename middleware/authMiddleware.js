const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer'))
    return res.status(401).json({ message: 'No token' });

  const token = auth.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

exports.admin = (req, res, next) => {
  if (req.user.role !== 'admin')
    return res.status(403).json({ message: 'Admin only' });
  next();
};

exports.customer = (req, res, next) => {
  if (req.user.role !== 'customer')
    return res.status(403).json({ message: 'Customer only' });
  next();
};
