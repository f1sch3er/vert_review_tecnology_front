import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AppToast } from '../../utils/alerts';
import { userService } from '../../services/userService';

export default function RegisterComplement() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    phone_number: '',
    birth_date: '',
    document_number: '',
    document_type: 'CPF' as 'CPF' | 'CNPJ',
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

  const handleTypeChange = (type: 'CPF' | 'CNPJ') => {
    setFormData(prev => ({
      ...prev,
      document_type: type,
      document_number: '' // Limpa para evitar formato errado no banco
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userService.completeRegistration(formData);

      AppToast.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your registration has been successfully completed.',
        timer: 2000,
        showConfirmButton: false
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      const errorData = error.response?.data;
      let msg = 'Error saving data.';

      if (Array.isArray(errorData)) {
        msg = errorData[0];
      } else if (errorData?.message) {
        msg = errorData.message;
      } else if (typeof errorData === 'object') {
        const firstKey = Object.keys(errorData)[0];
        msg = errorData[firstKey];
      }

      AppToast.fire({
        icon: 'error',
        title: 'Attention',
        text: msg
      });
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
            <h2 className="text-4xl font-black tracking-tighter text-white italic uppercase">Almost there!</h2>
            <p className="mt-4 text-slate-500 text-lg">Complete your profile to unlock all financial features.</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Document Type Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#1C2025] rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => handleTypeChange('CPF')}
                  className={`py-2.5 text-[11px] font-black rounded-lg transition-all tracking-wider ${
                    formData.document_type === 'CPF' 
                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  PERSONAL (CPF)
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('CNPJ')}
                  className={`py-2.5 text-[11px] font-black rounded-lg transition-all tracking-wider ${
                    formData.document_type === 'CNPJ' 
                    ? 'bg-brand-purple text-white shadow-lg shadow-brand-purple/20' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  BUSINESS (CNPJ)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label={`Document (${formData.document_type})`} 
                name="document_number" 
                placeholder={formData.document_type === 'CPF' ? "000.000.000-00" : "00.000.000/0000-00"}
                value={formData.document_number} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Phone Number" 
                name="phone_number" 
                placeholder="+55 11 9..."
                value={formData.phone_number} 
                onChange={handleChange} 
                required 
              />
            </div>

            <Input 
              label="Date of Birth" 
              name="birth_date" 
              type="date" 
              value={formData.birth_date} 
              onChange={handleChange} 
              required 
            />

            <div className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-white font-bold text-sm uppercase tracking-widest">Address Details</h3>
                <div className="h-px flex-1 bg-white/5" />
              </div>
              
              <div className="space-y-6">
                <Input 
                  label="Street / Avenue" 
                  name="address.street" 
                  placeholder="Street Name, 123"
                  value={formData.address.street} 
                  onChange={handleChange} 
                  required 
                />

                <div className="grid grid-cols-3 gap-4">
                  <Input 
                    label="Zip Code" 
                    name="address.zip_code" 
                    placeholder="00000-000"
                    value={formData.address.zip_code} 
                    onChange={handleChange} 
                    required 
                  />
                  <Input 
                    label="City" 
                    name="address.city" 
                    placeholder="New York"
                    value={formData.address.city} 
                    onChange={handleChange} 
                    required 
                  />
                  <Input 
                    label="State" 
                    name="address.state" 
                    placeholder="NY"
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
              className="mt-8 py-4 text-sm tracking-[0.1em] font-bold bg-brand-purple hover:bg-brand-purple/90"
            >
              FINALIZE REGISTRATION
            </Button>
          </form>
        </div>

        <div className="absolute bottom-8 left-0 w-full flex justify-center opacity-10 grayscale">
           <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-slate-400">
             KYC & Compliance Verification
           </p>
        </div>
      </div>

      {/* Right Side: Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0F1115] via-[#16191E] to-brand-purple/20 justify-center items-center border-l border-white/5 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-purple/5 rounded-full blur-[120px]" />
        
        <div className="text-center p-12 relative z-10">
            <h1 className="text-6xl font-black text-white mb-6 italic tracking-tighter uppercase leading-none">
              Core<br/>Banking
            </h1>
            <div className="h-1 w-20 bg-brand-purple mx-auto mb-8" />
            <p className="text-slate-400 max-w-sm mx-auto text-lg leading-relaxed font-medium">
              Security and compliance for your global transactions.
            </p>
        </div>
      </div>
    </div>
  );
}