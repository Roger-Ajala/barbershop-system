import { Router } from 'express';
import { UserController } from './controllers/UserController';
import { ServiceController } from './controllers/ServiceController';
import { AppointmentController } from './controllers/AppointmentController'; // Importe aqui
import { ensureAuthenticated } from './middlewares/ensureAuthenticated';

const routes = Router();
const userController = new UserController();
const serviceController = new ServiceController();
const appointmentController = new AppointmentController(); // Instancie aqui

// Rotas públicas
routes.post('/users', userController.create);
routes.post('/login', userController.login);
routes.get('/services', serviceController.getAll);

// Rotas privadas
routes.get('/me', ensureAuthenticated, userController.me);
routes.post('/services', ensureAuthenticated, serviceController.create);
routes.get('/appointments/schedule', ensureAuthenticated, appointmentController.listBarberSchedule);

// NOVA ROTA: Criar agendamento (Exige estar logado)
routes.post('/appointments', ensureAuthenticated, appointmentController.create);
// NOVA ROTA: Listar agendamentos do próprio cliente (Exige estar logado)
routes.get('/appointments/me', ensureAuthenticated, appointmentController.listClientAppointments);

export { routes };