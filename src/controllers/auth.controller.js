import httpStatus from 'http-status';
import lodash from 'lodash';
import { generateRefreshToken, generateAccessToken, hashPassword } from '../utils/auth.js';
import bcrypt from 'bcrypt';
import User from '../db/models/user.js';

const { omit } = lodash;

/**
 * Returns jwt token if registration was successful
 * @public
 */
export const register = async (req, res, next) => {
  try {
    const existingUser = await User.query().findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(httpStatus.CONFLICT).json({ message: 'Email already exists' });
    }
    
    const hashedPassword = await hashPassword(req.body.password);
    const userData = { ...omit(req.body, 'role'), password: hashedPassword };

    const user = await User.query().insertAndFetch(userData);
    const transformedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(httpStatus.CREATED);
    return res.json({ user: transformedUser, accessToken, refreshToken });
  } catch (error) {
    console.error("Error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message: 'Internal Server Error'});
  }
};


/**
 * Returns jwt tokens if login was successful
 * @public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.query().findOne({ email });
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const responseUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.status(httpStatus.OK);
    return res.json({ user: responseUser, tokens: { access: { token: accessToken }, refresh: {token: refreshToken} }});
  } catch (error) {
    console.error("Error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
  }
};
