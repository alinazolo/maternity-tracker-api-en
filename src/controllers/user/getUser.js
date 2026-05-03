import createHttpError from 'http-errors';

export async function getUser(req, res) {
  if (!req.user) {
    throw createHttpError(401, 'Not authorized');
  }

  res.status(200).json(req.user);
}
