import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class ServiceController {
  // Método para cadastrar um novo serviço
  async create(request: Request, response: Response) {
    // Regra de Negócio: Somente Admin ou Barbeiro podem criar serviços
    const userRole = request.user.role;

    if (userRole === 'CLIENT') {
      return response.status(403).json({ error: 'Acesso negado. Apenas administradores podem criar serviços.' });
    }

    const { name, price, durationMin } = request.body;

    try {
      const service = await prisma.service.create({
        data: {
          name,
          price,
          durationMin,
        },
      });

      return response.status(201).json(service);
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao criar o serviço.' });
    }
  }

  // Método para listar todos os serviços (Público)
  async getAll(request: Request, response: Response) {
    const services = await prisma.service.findMany();
    return response.json(services);
  }
}