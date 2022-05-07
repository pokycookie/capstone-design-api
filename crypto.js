const crypto = require("crypto");

const encrypt = (password) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) reject(err);
      const salt = buf.toString("base64");
      crypto.pbkdf2(password, salt, 131567, 64, "sha512", (err, key) => {
        if (err) reject(err);
        resolve({ salt, key: key.toString("base64") });
      });
    });
  });
};

const decrypt = (salt, password) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 131567, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve(key.toString("base64"));
    });
  });
};

module.exports = { encrypt, decrypt };
