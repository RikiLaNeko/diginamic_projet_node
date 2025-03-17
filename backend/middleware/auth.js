const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    console.warn("⚠️ Aucun token fourni dans les headers");
    return res.status(403).json({ message: "Un token est requis pour accéder à cette ressource" });
  }

  // Vérification du format "Bearer <token>"
  let token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Token invalide:", err.message);
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = auth;
