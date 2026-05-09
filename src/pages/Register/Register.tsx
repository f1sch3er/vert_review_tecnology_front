import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AppToast } from '../../utils/alerts';
import { userService } from '../../services/userService'; 
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

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

    if (formData.password !== formData.confirmPassword) {
      AppToast.fire({ icon: 'error', title: 'Passwords do not match!' });
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await api.get(`/users/check-email/`, {
        params: { email: formData.email }
      });

      if (data.exists) {
        AppToast.fire({
          icon: 'warning',
          title: 'Email already in use!',
          text: 'This email address is already registered in our platform.'
        });
        return;
      }
      
      await userService.register(formData);
      await signIn({ email: formData.email, password: formData.password });

      AppToast.fire({
        icon: 'success',
        title: 'Account created! Signing in...'
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Failed to create account.';
      AppToast.fire({ icon: 'error', title: serverMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0F1115] font-sans">
      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 relative">
        <div className="max-w-md w-full mx-auto space-y-10">
          <header>
            <h2 className="text-5xl font-black tracking-tighter text-white italic uppercase drop-shadow-sm">
              {appName}
            </h2>
            <p className="mt-4 text-slate-500 text-lg">
              Create your account and start transacting globally.
            </p>
          </header>
          
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="First Name" 
                name="firstName" 
                placeholder="John"
                value={formData.firstName} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Last Name" 
                name="lastName" 
                placeholder="Doe"
                value={formData.lastName} 
                onChange={handleChange} 
                required 
              />
            </div>

            <Input 
              label="Email Address" 
              name="email" 
              type="email" 
              placeholder="name@example.com"
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Password" 
                name="password" 
                type="password" 
                placeholder="••••••••"
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Confirm" 
                name="confirmPassword" 
                type="password" 
                placeholder="••••••••"
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
            </div>

            <Button 
              type="submit"
              isLoading={isLoading}
              className="mt-6 py-4 text-sm tracking-[0.1em] font-bold"
            >
              CREATE MY ACCOUNT
            </Button>
          </form>

          <footer className="pt-4">
            <p className="text-center text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-purple font-bold hover:text-brand-purple/80 transition-colors underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </p>
          </footer>
        </div>

        {/* Footer de Segurança sutil */}
        <div className="absolute bottom-8 left-0 w-full flex justify-center opacity-10 grayscale">
           <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
             Ledger Protocol Secured
           </p>
        </div>
      </div>

  
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F1115] via-[#16191E] to-brand-purple/20 justify-center items-center border-l border-white/5 relative overflow-hidden">
       
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px]" />
        
        <div className="text-center p-12 relative z-10">
            <h1 className="text-6xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">
              Core<br/>Banking
            </h1>
            <div className="h-1 w-20 bg-brand-purple mx-auto mb-8" />
            <p className="text-slate-400 max-w-xs mx-auto text-lg leading-relaxed font-medium">
              The next generation of financial infrastructure. Your journey starts now.
            </p>
        </div>
      </div>
    </div>
  );
}