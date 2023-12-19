const jwt = require("jsonwebtoken");
const jwtPassword = "secret";
const zod = require("zod");

const schema = zod.object({
  username: zod.string().email(),
  password: zod.string().min(6),
});
// const passwordSchema = zod.

function signJwt(username, password) {
  const validate = schema.safeParse({ username, password });
  if (!validate.success) return null;
  const token = jwt.sign({ username }, jwtPassword);
  return token;
}

function verifyJwt(token) {
  try {
    const verify = jwt.verify(token, jwtPassword);
    return true;
  } catch (err) {
    return false;
  }
}

function decodeJwt(token) {
  const decode = jwt.decode(token);
  if (decode) return true;
  else return false;
}

module.exports = {
  signJwt,
  verifyJwt,
  decodeJwt,
  jwtPassword,
};
