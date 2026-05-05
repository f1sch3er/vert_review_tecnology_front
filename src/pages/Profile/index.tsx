import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { UI_TEXTS } from '../../const/texts';
import { accountService } from '../../services/accountService';
import { AppToast } from '../../utils/alerts';

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Novo estado para o botão de salvar
  const texts = UI_TEXTS.PT;
  const profileTexts = texts.PROFILE;

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "", 
    birth_date: "",
    document_number: "",
    document_type: "",
    address: {
      street: "",
      city: "",
      state: "",
      zip_code: ""
    }
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await accountService.getProfile();
        setProfile(data);
      } catch (error: any) {
        // Se der 401 aqui, o interceptor do api.ts deve lidar, 
        // mas exibimos o alerta por segurança.
        AppToast.fire({
          icon: 'error',
          title: error.response?.data?.message || 'Erro ao carregar perfil'
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [objKey, fieldKey] = name.split('.');
      if (objKey === 'address') {
        setProfile(prev => ({
          ...prev,
          address: {
            ...prev.address,
            [fieldKey]: value
          }
        }));
      }
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true); 

    try {
      await accountService.updateProfile(profile);
      AppToast.fire({ 
        icon: 'success', 
        title: 'Perfil atualizado com sucesso!' 
      });
    } catch (error: any) {
      AppToast.fire({ 
        icon: 'error', 
        title: error.response?.data?.message || 'Erro ao salvar alterações.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-dark text-white p-8 lg:p-12 font-sans">
      <main className="max-w-5xl mx-auto w-full space-y-6">
        
        {/* Botão Voltar Otimizado */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-purple transition-all font-medium group mb-4"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          {texts.COMMON?.BACK_BUTTON || 'Voltar'}
        </button>

        <header className="pb-4">
          <h2 className="text-3xl font-black italic tracking-tight uppercase">
            {profileTexts.TITLE}
          </h2>
          <p className="text-gray-400 mt-2">
            {profileTexts.DESCRIPTION}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <section className="lg:col-span-2 space-y-6 bg-[#111114] p-8 rounded-3xl border border-gray-800 shadow-sm">
            <h3 className="text-lg font-bold border-b border-gray-800 pb-4 mb-6 text-brand-purple">
              {profileTexts.SECTIONS.BASIC_INFO}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label={profileTexts.FIELDS.FIRST_NAME} name="first_name" value={profile.first_name} onChange={handleChange} />
              <Input label={profileTexts.FIELDS.LAST_NAME} name="last_name" value={profile.last_name} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label={profileTexts.FIELDS.EMAIL} name="email" type="email" value={profile.email} onChange={handleChange} disabled /> 
              <Input label={profileTexts.FIELDS.PHONE} name="phone" value={profile.phone} onChange={handleChange} />
            </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-400">
                  {profileTexts.FIELDS.DOC_TYPE}
                </label>

                <select
                  name="document_type"
                  value={profile.document_type}
                  onChange={(e) =>
                    setProfile(prev => ({
                      ...prev,
                      document_type: e.target.value
                    }))
                  }
                  className="bg-[#1a1a1f] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="">Selecione</option>
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
              </div>
              
              <Input label={profileTexts.FIELDS.DOC_NUMBER} name="document_number" value={profile.document_number} onChange={handleChange} />
              <Input label={profileTexts.FIELDS.BIRTH_DATE} name="birth_date" type="date" value={profile.birth_date} onChange={handleChange} />
            </div>
          </section>

          <div className="space-y-8">
            <section className="bg-[#111114] p-8 rounded-3xl border border-gray-800 space-y-6 shadow-sm">
              <h3 className="text-lg font-bold border-b border-gray-800 pb-4 text-brand-purple">
                {profileTexts.SECTIONS.ADDRESS}
              </h3>
              <Input label={profileTexts.FIELDS.ZIP_CODE} name="address.zip_code" value={profile.address?.zip_code || ""} onChange={handleChange} />
              <Input label={profileTexts.FIELDS.STREET} name="address.street" value={profile.address?.street || ""} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <Input label={profileTexts.FIELDS.CITY} name="address.city" value={profile.address?.city || ""} onChange={handleChange} />
                <Input label={profileTexts.FIELDS.STATE} name="address.state" value={profile.address?.state || ""} onChange={handleChange} />
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isSaving}
              className={`w-full bg-brand-purple hover:bg-brand-accent text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-brand-purple/20 uppercase tracking-[0.15em] hover:scale-[1.02] active:scale-[0.98] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? 'Salvando...' : profileTexts.SAVE_BTN}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}