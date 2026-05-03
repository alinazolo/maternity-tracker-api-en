import { logoutService } from '../../services/auth.js';

export async function logoutUser(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    await logoutService(refreshToken);

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
