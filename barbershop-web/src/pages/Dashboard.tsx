import { NewAppointmentModal } from '../components/NewAppointmentModal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';



interface Appointment {
  id: string;
  date: string;
  service: { name: string; price: number | string };
  barber: { name: string };
}

export default function Dashboard() {
  const navigate = useNavigate();
  
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadAppointments() {
    try {
      const response = await api.get('/appointments/schedule');
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
      handleLogout();
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('@Barbershop:token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabeçalho Utilitário */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-800 pb-4 gap-4">
          <div>
            <h1 className="text-2xl text-white uppercase tracking-widest font-bold">
              [ Sistema de Agendamentos ]
            </h1>
            <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">
              Módulo de Controle // Status: Conectado
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-xs border border-zinc-700 text-zinc-400 hover:bg-white hover:text-black transition-colors px-4 py-2 uppercase tracking-widest"
          >
            Encerrar Sessão
          </button>
        </header>

        {/* Painel Principal */}
        <main>
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-sm uppercase tracking-widest text-emerald-500 font-bold">
               Próximos Horários
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs bg-white text-black px-4 py-2 hover:bg-zinc-300 active:scale-[0.98] transition-all uppercase tracking-widest font-bold"> 
              + Novo Agendamento
            </button>
          </div>

          {/* Tabela de Dados Brutalista */}
          <div className="border border-zinc-800 overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-900 border-b border-zinc-800 text-xs uppercase tracking-widest text-zinc-500">
                <tr>
                  <th className="p-4 font-normal">Data / Hora</th>
                  <th className="p-4 font-normal">Serviço</th>
                  <th className="p-4 font-normal border-l border-zinc-800">Profissional</th>
                  <th className="p-4 font-normal border-l border-zinc-800 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {appointments.map((apt) => {
                  
                  const dateObj = new Date(apt.date);
                  const formattedDate = dateObj.toLocaleDateString('pt-BR');
                  const formattedTime = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

                  return (
                    <tr key={apt.id} className="hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4">
                        <strong className="text-white font-normal">{formattedDate}</strong>
                        <span className="text-zinc-500 ml-2">[{formattedTime}]</span>
                      </td>
                      <td className="p-4 text-zinc-300">{apt.service.name}</td>
                      <td className="p-4 border-l border-zinc-800 text-zinc-400">{apt.barber.name}</td>
                      <td className="p-4 border-l border-zinc-800 text-right text-emerald-400 font-bold">
                        R$ {Number(apt.service.price).toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </main>

      </div>
      <NewAppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadAppointments}
      />
    </div>
  );
}