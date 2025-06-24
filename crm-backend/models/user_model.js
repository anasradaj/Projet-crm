const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'] 
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true, 
    lowercase: true,
    match: [/.+@.+\..+/, 'Veuillez entrer un email valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères']
  },
  role: {
    type: String,
    enum: ['employer', 'manager'], 
    default: 'manager' 
  },
}, {
  timestamps: true 
});

// Middleware Mongoose pour hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) { // Ne hacher que si le mot de passe a été modifié ou est nouveau
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Générer un "sel" (salt)
  this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
  next();
});

// Méthode pour comparer les mots de passe (utilisée lors de la connexion)
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;