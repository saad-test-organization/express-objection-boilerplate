import { verifyAccessToken } from '../utils/auth.js';
import httpStatus from 'http-status';

export const auth = (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Access token is missing' });
  }

  try {
    const decodedToken = verifyAccessToken(accessToken);
    req.userId = decodedToken.sub;
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Invalid access token' });
  }
};
