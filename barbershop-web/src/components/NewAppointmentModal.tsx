import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Service {
  id: string;
  name: string;
  price: number | string;
}

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function NewAppointmentModal({ isOpen, onClose, onSuccess }: NewAppointmentModalProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [barberId, setBarberId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadFormData() {
      try {
        const [servicesRes, meRes] = await Promise.all([
          api.get('/services'),
          api.get('/me'),
        ]);
        setServices(servicesRes.data);
        setBarberId(meRes.data.id);
        if (servicesRes.data.length > 0) {
          setServiceId(servicesRes.data[0].id);
        }
      } catch (err) {
        setError('Erro ao carregar serviços ou dados do usuário.');
      }
    }

    loadFormData();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/appointments', {
        serviceId,
        barberId,
        date: new Date(date).toISOString(),
      });

      setDate('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar agendamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 font-mono">
      <div className="w-full max-w-md border border-zinc-700 bg-black p-6">
        
        <div className="flex justify-between items-center border-b border-zinc-800 pb-4 mb-6">
          <h2 className="text-sm text-white uppercase tracking-widest font-bold">
            [ Novo Agendamento ]
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs uppercase tracking-widest"
          >
            [ X ]
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-red-900 bg-red-950/30 text-red-500 text-xs uppercase tracking-widest">
            [ ERRO ] {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">
              Serviço
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-black border border-zinc-700 text-white p-3 focus:outline-none focus:border-white rounded-none"
              required
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} — R$ {Number(service.price).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">
              Data e Hora
            </label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black border border-zinc-700 text-white p-3 focus:outline-none focus:border-white rounded-none [color-scheme:dark]"
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-white p-3 text-xs uppercase tracking-widest transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-white text-black font-bold hover:bg-zinc-300 active:scale-[0.98] p-3 text-xs uppercase tracking-widest transition-all disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Confirmar'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}