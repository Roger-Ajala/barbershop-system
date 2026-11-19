import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  // 1. Pega o token enviado no cabeçalho da requisição
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({ error: 'Token JWT não informado.' });
  }

  // 2. O token chega no formato "Bearer asd123asd...". Vamos separar pelo espaço.
  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não está configurado.');
    }

    // 3. Tenta decodificar o token. Se for inválido ou estiver expirado, ele cai no catch.
    const decoded = jwt.verify(token, secret);
    
    // Forçamos o TypeScript a entender o formato do payload
    const { id, role } = decoded as TokenPayload;

    // 4. Injeta os dados do usuário na requisição para uso nos próximos controllers
    request.user = { id, role };

    // 5. Permite que a requisição siga seu fluxo normal
    return next();
  } catch (error) {
    return response.status(401).json({ error: 'Token JWT inválido ou expirado.' });
  }
}