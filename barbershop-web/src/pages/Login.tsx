import { useState } from 'react';
import { api } from '../services/api';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para capturar e exibir erros do back-end
  const [error, setError] = useState<string | null>(null);
  
  // Hook do React Router para forçar a mudança de página
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.successMessage;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores ao tentar novamente

    try {
      // 1. Dispara a requisição POST para o back-end
      const response = await api.post('/login', {
        email,
        password
      });

      // 2. Extrai o token da resposta da API
      const { token } = response.data;

      // 3. Salva o token no navegador (localStorage)
      // É assim que o front-end "lembra" que você está logado nas próximas telas
      localStorage.setItem('@Barbershop:token', token);

      // 4. Redireciona o usuário para o painel
      navigate('/dashboard');

    } catch (err: any) {
      // Captura o erro disparado pelo back-end (ex: "Credenciais inválidas")
      if (err.response && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Falha na conexão com o servidor.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono p-4">
      <div className="w-full max-w-sm border border-zinc-800 bg-black p-8">
        
        <div className="mb-8 border-b border-zinc-800 pb-4">
          <h1 className="text-xl text-white uppercase tracking-widest font-bold">
            [ Autenticação ]
          </h1>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-wide">
            Acesso administrativo // Barbershop
          </p>
        </div>

        {/* Bloco de Erro Minimalista */}
        {error && (
          <div className="mb-6 p-3 border border-red-900 bg-red-950/30 text-red-500 text-xs uppercase tracking-widest">
            [ ERRO ] {error}
          </div>
        )}
          {successMessage && (
          <div className="mb-4 p-3 border border-emerald-800 bg-emerald-950/30 text-emerald-400 text-xs uppercase tracking-widest">
              [ OK ] {successMessage}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2" htmlFor="email">
              Endereço de E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-zinc-700 text-white p-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors rounded-none placeholder:text-zinc-700"
              placeholder="admin@sistema.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-zinc-400 uppercase tracking-widest mb-2" htmlFor="password">
              Palavra-passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-zinc-700 text-white p-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors rounded-none placeholder:text-zinc-700"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-bold uppercase tracking-widest p-4 hover:bg-zinc-300 active:scale-[0.98] transition-all rounded-none mt-2"
          >
            Iniciar Sessão
          </button>

        </form>
        <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
       <Link
        to="/register"
         className="text-xs text-zinc-400 hover:text-white uppercase tracking-widest transition-colors"
          >
          Não tem acesso? [ Criar Conta ]
          </Link>
          </div>

        <div className="mt-8 flex justify-between items-center text-[10px] text-zinc-600 uppercase tracking-widest border-t border-zinc-800 pt-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 block"></span>
            Sistema Online
          </span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}