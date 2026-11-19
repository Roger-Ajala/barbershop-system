import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export class AppointmentController {
  async create(request: Request, response: Response) {
   
    const clientId = request.user.id; 
    
    const { barberId, serviceId, date } = request.body;

    
    const appointmentDate = new Date(date);

   
    if (appointmentDate < new Date()) {
      return response.status(400).json({ error: 'Não é possível agendar em um horário que já passou.' });
    }

    
    const conflictingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId,
        date: appointmentDate,
      
      },
    });

    if (conflictingAppointment) {
      return response.status(400).json({ error: 'Este horário já está reservado com este barbeiro.' });
    }

    try {
     
      const appointment = await prisma.appointment.create({
        data: {
          date: appointmentDate,
          clientId,
          barberId,
          serviceId,
        },
       
        include: {
          barber: { select: { name: true } },
          service: { select: { name: true, price: true } }
        }
      });

      return response.status(201).json(appointment);
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao criar o agendamento. Verifique se os IDs informados estão corretos.' });
    }
  }
  
  async listClientAppointments(request: Request, response: Response) {
    const clientId = request.user.id;

    const appointments = await prisma.appointment.findMany({
      where: {
        clientId,
      },
      
      orderBy: {
        date: 'desc', 
      },
      
      include: {
        barber: { select: { name: true } },
        service: { select: { name: true, price: true, durationMin: true } },
      },
    });

    return response.json(appointments);
  }

  // Novo método para listar os agendamentos onde o usuário logado é o Barbeiro
  async listBarberSchedule(request: Request, response: Response) {
    const barberId = request.user.id; // Pegamos o ID do barbeiro logado

    const appointments = await prisma.appointment.findMany({
      where: {
        barberId, // Filtramos pela agenda DELE
      },
      orderBy: {
        date: 'asc', // Ordena dos mais próximos para os mais distantes
      },
      include: {
        barber: { select: { name: true } },
        service: { select: { name: true, price: true } },
      },
    });

    return response.json(appointments);
  }
}