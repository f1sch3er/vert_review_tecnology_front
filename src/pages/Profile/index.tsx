import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/Input';
import { UI_TEXTS } from '../../const/texts';
import { accountService } from '../../services/accountService';
import { AppToast } from '../../utils/alerts';

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [objKey, fieldKey] = name.split('.');
      if (objKey === 'address') {
        setProfile(prev => ({
          ...prev,
          address: { ...prev.address, [fieldKey]: value }
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
      AppToast.fire({ icon: 'success', title: 'Perfil atualizado!' });
    } catch (error: any) {
      AppToast.fire({ 
        icon: 'error', 
        title: error.response?.data?.message || 'Erro ao salvar.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-[#0F1115]" />;

  return (
    <div className="flex min-h-screen bg-[#0F1115] font-sans overflow-x-hidden text-slate-200">
      
      {/* LADO ESQUERDO: FORMULÁRIO (60%) */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center px-8 md:px-24 py-20 relative">
        
        {/* Botão Voltar com respiro extra */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-16 left-8 md:left-24 text-[10px] font-black text-slate-500 hover:text-brand-purple uppercase tracking-[0.3em] transition-all italic"
        >
          ← {texts.COMMON?.BACK_BUTTON || 'Voltar'}
        </button>

        <div className="max-w-2xl w-full mx-auto space-y-12">
          <header>
            <h1 className="text-5xl font-black tracking-tighter text-white italic uppercase leading-none">
              {profileTexts.TITLE.split(' ')[0]}<br/>
              <span className="text-brand-purple">{profileTexts.TITLE.split(' ')[1]}</span>
            </h1>
            <p className="mt-4 text-slate-500 text-lg max-w-sm">
              {profileTexts.DESCRIPTION}
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* 01. Informações Básicas */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] border-b border-white/5 pb-2">
                01. {profileTexts.SECTIONS.BASIC_INFO}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={profileTexts.FIELDS.FIRST_NAME} name="first_name" value={profile.first_name} onChange={handleChange} required />
                <Input label={profileTexts.FIELDS.LAST_NAME} name="last_name" value={profile.last_name} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={profileTexts.FIELDS.EMAIL} name="email" type="email" value={profile.email} onChange={handleChange} disabled /> 
                <Input label={profileTexts.FIELDS.PHONE} name="phone" value={profile.phone} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1 italic">
                    {profileTexts.FIELDS.DOC_TYPE}
                  </label>
                  <select
                    name="document_type"
                    value={profile.document_type}
                    onChange={handleChange}
                    className="w-full bg-[#1C2025] border border-white/5 rounded-xl text-sm text-slate-200 p-3.5 focus:outline-none focus:border-brand-purple/40 transition-all"
                  >
                    <option value="CPF">CPF</option>
                    <option value="CNPJ">CNPJ</option>
                  </select>
                </div>
                <Input label={profileTexts.FIELDS.DOC_NUMBER} name="document_number" value={profile.document_number} onChange={handleChange} />
                <Input label={profileTexts.FIELDS.BIRTH_DATE} name="birth_date" type="date" value={profile.birth_date} onChange={handleChange} />
              </div>
            </div>

            {/* 02. Endereço */}
            <div className="space-y-6">
              <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] border-b border-white/5 pb-2">
                02. {profileTexts.SECTIONS.ADDRESS}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <Input label={profileTexts.FIELDS.ZIP_CODE} name="address.zip_code" value={profile.address?.zip_code} onChange={handleChange} />
                </div>
                <div className="md:col-span-3">
                  <Input label={profileTexts.FIELDS.STREET} name="address.street" value={profile.address?.street} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <Input label={profileTexts.FIELDS.CITY} name="address.city" value={profile.address?.city} onChange={handleChange} />
                <Input label={profileTexts.FIELDS.STATE} name="address.state" value={profile.address?.state} onChange={handleChange} />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-5 bg-brand-purple hover:bg-brand-purple/90 text-white font-black uppercase tracking-[0.3em] italic rounded-2xl transition-all shadow-2xl shadow-brand-purple/20 disabled:opacity-50 active:scale-[0.98]"
            >
              {isSaving ? 'Synchronizing...' : profileTexts.SAVE_BTN}
            </button>
          </form>
        </div>
      </div>

      {/* LADO DIREITO: IDENTIDADE (40%) */}
      <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-[#0F1115] via-[#16191E] to-brand-purple/10 justify-center items-center border-l border-white/5 relative overflow-hidden">
        
        {/* Glow Central Sutil */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-purple/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center p-12 relative z-10">
            {/* Ícone Minimalista sem círculo */}
            <div className="mb-6 flex items-center justify-center text-5xl opacity-80">
               👤
            </div>
            
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight">
              Identity<br/>Verified
            </h2>
            
            <div className="mt-8 space-y-2 border-t border-white/5 pt-8">
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black">
                Account Node: <span className="text-slate-300 ml-1">{profile.email.split('@')[0]}</span>
              </p>
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-black">
                Security Level: <span className="text-slate-300 ml-1">AES-256</span>
              </p>
            </div>
        </div>

        {/* Decorativo ID_01 Discreto */}
        <div className="absolute bottom-10 right-10 opacity-20">
          <p className="text-sm font-black text-white italic tracking-[0.5em] select-none uppercase">
            ID_01
          </p>
        </div>
      </div>
    </div>
  );
}