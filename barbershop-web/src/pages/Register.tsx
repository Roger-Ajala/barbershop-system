import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post('/users', {
        name,
        email,
        password,
      });

      // Redireciona para o login enviando um aviso de confirmação
      navigate('/login', {
        state: { successMessage: 'Conta criada com sucesso. Faça login para acessar.' },
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao criar conta. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-300 font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-md border border-zinc-800 bg-black p-8">
        
        {/* Cabeçalho */}
        <div className="border-b border-zinc-800 pb-4 mb-6">
          <h1 className="text-xl text-white uppercase tracking-widest font-bold">
            [ Novo Cadastro ]
          </h1>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">
            Criar credencial de acesso ao sistema
          </p>
        </div>

        {/* Feedback de Erro */}
        {error && (
          <div className="mb-4 p-3 border border-red-900 bg-red-950/30 text-red-500 text-xs uppercase tracking-widest">
            [ ERRO ] {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Recrutador Tech"
              className="w-full bg-black border border-zinc-700 text-white p-3 focus:outline-none focus:border-white rounded-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recrutador@empresa.com"
              className="w-full bg-black border border-zinc-700 text-white p-3 focus:outline-none focus:border-white rounded-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              className="w-full bg-black border border-zinc-700 text-white p-3 focus:outline-none focus:border-white rounded-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold hover:bg-zinc-300 active:scale-[0.98] p-3 text-xs uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Finalizar Cadastro'}
          </button>
        </form>

        {/* Link de retorno para o Login */}
        <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
          <Link
            to="/login"
            className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors"
          >
            Já possui conta? [ Fazer Login ]
          </Link>
        </div>

      </div>
    </div>
  );
}