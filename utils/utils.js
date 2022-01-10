const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const createToken = user => {

  console.log('here');
  return jwt.sign(
    {
      sub: user.user_id,
      email: user.user_email,
      role: user.role,
      iss: 'api.test',
      aud: 'api.test'
    },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '1h' }
  );
};

const hashPassword = password => {
  return new Promise((resolve, reject) => {
    // Generate a salt at level 12 strength
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const verifyPassword = (
  passwordAttempt,
  hashedPassword
) => {
  return bcrypt.compare(passwordAttempt, hashedPassword);
};


module.exports = {
  createToken,
  hashPassword,
  verifyPassword,
};
