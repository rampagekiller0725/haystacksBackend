import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "secret_key";

/**
 * @description Generate token with given claim
 * @param {object} claim object to be wrapped in the token
 * @param {string | number | undefined} expiresIn expire time. ex: '1h', '1m', 50
 * @return {string} generated token
 */
export const jwtTokenGenerate = (claim, expiresIn = "36d") => {
  let options = {};

  if (expiresIn) {
    options = {
      expiresIn,
    };
  }
  return jwt.sign(claim, JWT_SECRET_KEY, options);
};

/**
 *
 * @param {string} token token
 * @return {any} decoded object of token
 */
export const jwtTokenVerify = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

// module.exports={
//   ['jwtTokenGenerate']:(claim) => jwtTokenGenerate(claim),
//   ['jwtTokenVerify']:(token) => jwtTokenVerify(token)
// }