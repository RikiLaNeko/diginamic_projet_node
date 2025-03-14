const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; 

const auth = (req, res, next) => {
  // Récupère le token dans le header "Authorization"
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "Un token est requis pour accéder à cette ressource" });
  }

  // Si le token est de la forme "Bearer <token>", on enlève "Bearer "
  let token = authHeader;
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    // Vérifie le token avec la clé secrète
    const decoded = jwt.verify(token, JWT_SECRET);
    // Optionnel : tu peux stocker les infos décodées dans req pour les utiliser plus tard
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

module.exports = auth;
