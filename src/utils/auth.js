import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config';

const {saltRounds, jwtSecret, jwtExpirationAccess, jwtExpirationRefresh} = config
/**
 * Hashes a password using bcrypt
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - Resolves to the hashed password
 */
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Generates an access token for a user
 * @param {object} user - The user object
 * @returns {string} - The generated access token
 */
export const generateAccessToken = (user) => {
  const payload = {
    sub: user.id,
    email: user.email,
  };

  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpirationAccess });
};

/**
 * Generates a refresh token for a user
 * @param {object} user - The user object
 * @returns {string} - The generated refresh token
 */
export const generateRefreshToken = (user) => {
  const payload = {
    sub: user.id
  };

  return jwt.sign(payload, jwtSecret, { expiresIn:jwtExpirationRefresh });
};

/**
 * Verifies an access token and returns the decoded payload
 * @param {string} accessToken - The access token to verify
 * @returns {object} - The decoded payload
 */
export const verifyAccessToken = (accessToken) => {
  try {
    const token = accessToken.split(' ')[1];
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

/**
 * Verifies a refresh token and returns the decoded payload
 * @param {string} refreshToken - The refresh token to verify
 * @returns {object} - The decoded payload
 */
export const verifyRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, jwtSecret);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};
