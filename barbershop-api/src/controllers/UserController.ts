import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export class UserController {
  // Método para criar usuário
  async create(request: Request, response: Response) {
    const { name, email, password } = request.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      const { password: _, ...userWithoutPassword } = user;
      return response.status(201).json(userWithoutPassword);
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao criar usuário. Este email já está em uso?' });
    }
  }

  // Método para fazer login
  async login(request: Request, response: Response) {
    const { email, password } = request.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET não está configurado no ambiente.');
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    const { password: _, ...userWithoutPassword } = user;

    return response.json({
      user: userWithoutPassword,
      token,
      
    });
  }
    // Cole o código do método "me" a partir daqui (sua linha 61)
    async me(request: Request, response: Response) {
      const userId = request.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return response.status(404).json({ error: 'Usuário não encontrado.' });
      }

      const { password: _, ...userWithoutPassword } = user;
      return response.json(userWithoutPassword);
    }
  }