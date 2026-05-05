import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button'; // Importando o novo componente
import { AppToast } from '../../utils/alerts';
import { userService } from '../../services/userService'; 
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api'; // Certifique-se de importar sua instância da API

const appName = import.meta.env.VITE_APP_NAME;

export default function Register() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false); 
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validação básica de senha
    if (formData.password !== formData.confirmPassword) {
      AppToast.fire({ icon: 'error', title: 'As senhas não coincidem!' });
      return;
    }

    try {
      setIsLoading(true);

      // 2. Chamada para checar se o e-mail já existe
      const { data } = await api.get(`/users/check-email/`, {
        params: { email: formData.email }
      });

      if (data.exists) {
        AppToast.fire({
          icon: 'warning',
          title: 'E-mail em uso!',
          text: 'Este endereço de e-mail já está cadastrado em nossa plataforma.'
        });
        return; // Interrompe o registro
      }
      
      // 3. Prossegue com o registro
      await userService.register(formData);
      
      // 4. Login automático
      await signIn({ email: formData.email, password: formData.password });

      AppToast.fire({
        icon: 'success',
        title: 'Conta criada com sucesso! Entrando...'
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Erro ao criar conta.';
      AppToast.fire({ icon: 'error', title: serverMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark font-sans">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          <header>
            <h2 className="text-5xl font-extrabold tracking-tighter text-white">{appName}</h2>
            <p className="mt-4 text-gray-400 text-lg">Crie sua conta e comece a transacionar.</p>
          </header>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nome" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Input label="Sobrenome" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <Input label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Senha" name="password" type="password" value={formData.password} onChange={handleChange} required />
              <Input label="Confirmar" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
            </div>

            {/* Novo componente Button com suporte a loading e estilos padronizados */}
            <Button 
              type="submit"
              isLoading={isLoading}
              className="mt-4"
            >
              Criar minha conta
            </Button>
          </form>

          <p className="text-center text-gray-400">
            Já tem uma conta? <Link to="/login" className="text-brand-purple font-bold hover:underline">Voltar ao login</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-brand-dark via-brand-dark to-brand-purple/30 justify-center items-center border-l border-gray-800">
        <div className="text-center p-12">
            <h1 className="text-4xl font-bold text-white mb-4 italic tracking-tight uppercase">Core Banking</h1>
            <p className="text-gray-400 max-w-sm mx-auto text-lg leading-relaxed">
              A sua jornada financeira começa agora.
            </p>
        </div>
      </div>
    </div>
  );
}