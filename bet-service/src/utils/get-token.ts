import * as express from 'express';

export function getToken(req: express.Request): string | null {
  const authorization = req.headers['authorization'];
  if (typeof authorization === 'string') {
    const matchToken = authorization.match(/^Bearer (.*)$/);
    if (matchToken && matchToken.length === 2) {
      return matchToken[1];
    }
  }
  return null;
}
