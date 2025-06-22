// Middleware pour vérifier le rôle de l'utilisateur
const authorize = (...roles) => { // Prend en argument un ou plusieurs rôles autorisés
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      // Si l'utilisateur n'est pas attaché (pas authentifié)
      // ou si son rôle n'est pas dans la liste des rôles autorisés
      return res.status(403).json({ message: 'Accès refusé, vous n\'avez pas le rôle requis' });
    }
    next(); // L'utilisateur a le rôle requis, passer à la suite
  };
};

module.exports = { authorize };