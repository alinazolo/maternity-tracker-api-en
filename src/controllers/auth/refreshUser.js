import createHttpError from 'http-errors';
import { Session } from '../../models/session.js';
import { createSession, setSessionCookies } from '../../services/auth.js';

export async function refreshUser(req, res) {
  const { refreshToken, sessionId } = req.cookies;
  if (!refreshToken || !sessionId) {
    throw createHttpError(401, 'Refresh token not found');
  }

  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session hot found');
  }

  const isInvalidToken = new Date() > new Date(session.refreshTokenValidUntil);
  if (isInvalidToken) {
    throw createHttpError(401, 'Session token expired');
  }

  await Session.deleteOne({
    _id: sessionId,
    refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({ message: 'Session refreshed' });
}
