import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AppToast } from '../../utils/alerts';
import { userService } from '../../services/userService'; 

const appName = import.meta.env.VITE_APP_NAME;

export default function RegisterComplement() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: '',
    birth_date: '',
    document_number: '',
    document_type: 'CPF',
    address: {
      street: '',
      city: '',
      state: '',
      zip_code: ''
    }
  });

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as object),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.completeRegistration(formData);
   
      AppToast.fire({
        icon: 'success',
        title: 'Perfil atualizado!',
        text: 'Seu cadastro foi completado com sucesso.',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate('/dashboard'); 
      }, 1500);

    } catch (error: any) {
      const errorData = error.response?.data;
      
      let msg = 'Erro ao salvar dados.';

      if (Array.isArray(errorData)) {
        msg = errorData[0];
      } 

      else if (errorData?.message) {
        msg = errorData.message;
      }
      else if (typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        msg = errorData[firstKey];
      }

      AppToast.fire({ 
        icon: 'error', 
        title: 'Atenção',
        text: msg 
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-brand-dark font-sans">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12">
        <div className="max-w-md w-full mx-auto space-y-8">
          <header>
            <h2 className="text-4xl font-extrabold tracking-tighter text-white">Quase lá!</h2>
            <p className="mt-2 text-gray-400 text-lg">Complete seu perfil para liberar todas as funções.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="CPF" 
                name="document_number" 
                placeholder="000.000.000-00"
                value={formData.document_number} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Telefone" 
                name="phone_number" 
                placeholder="11999998888"
                value={formData.phone_number} 
                onChange={handleChange} 
                required 
              />
            </div>

            <Input 
              label="Data de Nascimento" 
              name="birth_date" 
              type="date" 
              value={formData.birth_date} 
              onChange={handleChange} 
              required 
            />

            <div className="pt-4">
              <h3 className="text-white font-semibold mb-4 border-b border-gray-800 pb-2">Endereço</h3>
              
              <div className="space-y-4">
                <Input 
                  label="Rua / Avenida / Logradouro" 
                  name="address.street" 
                  value={formData.address.street} 
                  onChange={handleChange} 
                  required 
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input 
                    label="CEP" 
                    name="address.zip_code" 
                    placeholder="00000-000"
                    value={formData.address.zip_code} 
                    onChange={handleChange} 
                    required 
                  />
                  <Input 
                    label="Cidade" 
                    name="address.city" 
                    value={formData.address.city} 
                    onChange={handleChange} 
                    required 
                  />
                  <Input 
                    label="UF" 
                    name="address.state" 
                    placeholder="SP"
                    value={formData.address.state} 
                    onChange={handleChange} 
                    maxLength={2}
                    required 
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              isLoading={isLoading}
              className="mt-6"
            >
              Finalizar cadastro
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-gradient-to-tr from-brand-dark via-brand-dark to-brand-purple/30 justify-center items-center border-l border-gray-800">
        <div className="text-center p-12">
            <h1 className="text-4xl font-bold text-white mb-4 italic tracking-tight uppercase">Core Banking</h1>
            <p className="text-gray-400 max-w-sm mx-auto text-lg leading-relaxed">
              Segurança e conformidade para suas transações.
            </p>
        </div>
      </div>
    </div>
  );
}