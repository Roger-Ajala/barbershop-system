import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('@Barbershop:token');

  // Se não houver token salvo, redireciona imediatamente para o login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza a página normalmente
  return <>{children}</>;
}