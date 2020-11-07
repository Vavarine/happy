import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface decodadeToken {
  id: number
}

export function verifyJWT(req: Request, res: Response, next: NextFunction) {
  var token = req.headers['x-access-token'] as string;

  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, process.env.SECRET as string, function (err, decode) {
    if (err) return res.status(500).json({
      auth: false, message: 'Failed to authenticate token.'
    });

    const { id } = decode as any

    // se tudo estiver ok, salva no request para uso posterior
    req.body.id = id;
    next();
  });
}
