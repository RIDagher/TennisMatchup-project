/*const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');
console.log(secret);*/
const bcrypt = require('bcrypt');

async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);
  console.log(hashed);
}

hashPassword('YourPlainText');
