import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Input } from '../../components/Input'; 
import { Button } from '../../components/Button'; 
import { AppToast } from '../../utils/alerts';
import { useAuth } from '../../hooks/useAuth';
import type { LoginCredentials } from '../../types/user';

const appName = import.meta.env.VITE_APP_NAME;

export default function Login() {
  const { signIn } = useAuth(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      AppToast.fire({
        icon: 'error',
        title: 'Por favor, preencha todos os campos!'
      });
      return;
    }

    try {
      setIsLoading(true);

      const credentials: LoginCredentials = { email, password };

      // O signIn agora cuida da chamada ao service e do armazenamento dos dados
      await signIn(credentials); 

      AppToast.fire({
        icon: 'success',
        title: 'Bem-vindo de volta!'
      });

    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'E-mail ou senha incorretos.';
      
      AppToast.fire({
        icon: 'error',
        title: serverMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark font-sans">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div>
            <h2 className="text-5xl font-extrabold tracking-tighter text-white">{appName}</h2>
            <p className="mt-4 text-gray-400 text-lg">Acesse sua conta para transacionar.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <Input 
              label="E-mail"
              type="email" 
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              label="Senha"
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-brand-purple hover:text-brand-accent font-medium">Esqueceu a senha?</a>
            </div>

            {/* Novo componente Button substituindo o <button> nativo */}
            <Button 
              type="submit"
              isLoading={isLoading}
            >
              Entrar na conta
            </Button>
          </form>

          <p className="text-center text-gray-400">
            Ainda não tem conta? <Link to="/register" className="text-brand-purple font-bold hover:underline">Crie agora</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-brand-dark via-brand-dark to-brand-purple/30 justify-center items-center border-l border-gray-800">
        <div className="text-center p-12">
            <div className="relative inline-block mb-8">
              <div className="absolute -inset-4 bg-brand-purple rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <img src="/src/assets/react.svg" className="w-32 h-32 relative" alt="Logo" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Pagamentos em tempo real</h1>
            <p className="text-gray-400 max-w-sm mx-auto text-lg leading-relaxed">
              A plataforma de core banking feita para a nova geração de fintechs.
            </p>
        </div>
      </div>
    </div>
  );
}