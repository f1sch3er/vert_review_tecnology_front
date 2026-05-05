import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/Input';

const appName = import.meta.env.VITE_APP_NAME || "FlowPayment";

export default function Settings() {
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: '',
    smtpPort: '',
    user: '',
    password: ''
  });

  // Simulando um e-mail já conectado
  const connectedEmail = "fischer.pedro.social@gmail.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Tentando conectar ao servidor SMTP:", emailConfig);
    alert("Solicitação de conexão enviada para o serviço de e-mail.");
  };

  return (
    <div className="flex min-h-screen bg-brand-dark text-white font-sans">
      {/* Reutilizando a Sidebar simplificada */}
      <aside className="w-64 bg-dark-surface border-r border-gray-800 p-6 space-y-6">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 mb-10">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center font-black">F</div>
          <h1 className="text-xl font-bold tracking-tighter">{appName}</h1>
        </Link>
        <nav className="space-y-2">
          <Link to="/dashboard" className="block p-3 rounded-xl text-gray-400 hover:bg-gray-800 transition-all">Dashboard</Link>
          <Link to="/settings" className="block p-3 rounded-xl bg-brand-purple text-white font-medium">Configurações</Link>
        </nav>
      </aside>

      <main className="flex-1 p-8 lg:p-12 max-w-4xl">
        <header className="mb-10">
          <h2 className="text-3xl font-black tracking-tight italic">Configurações</h2>
          <p className="text-gray-400">Gerencie as integrações e comunicações do sistema.</p>
        </header>

        {/* Card de Status do E-mail */}
        <section className="bg-dark-surface border border-gray-800 rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-200">E-mail Conectado</h3>
            <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full border border-green-500/20 uppercase tracking-widest">
              Ativo
            </span>
          </div>
          <div className="flex items-center gap-4 p-4 bg-brand-dark rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
              <span className="text-xl">📧</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Último e-mail vinculado</p>
              <p className="font-mono text-brand-purple">{connectedEmail}</p>
            </div>
          </div>
        </section>

        {/* Formulário de Conexão */}
        <section className="bg-dark-surface border border-gray-800 rounded-3xl p-8">
          <h3 className="text-lg font-bold text-gray-200 mb-6">Conectar novo servidor SMTP</h3>
          
          <form onSubmit={handleConnect} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Servidor SMTP"
                name="smtpHost"
                placeholder="smtp.gmail.com"
                value={emailConfig.smtpHost}
                onChange={handleChange}
              />
              <Input 
                label="Porta"
                name="smtpPort"
                placeholder="587"
                value={emailConfig.smtpPort}
                onChange={handleChange}
              />
            </div>

            <Input 
              label="Usuário / E-mail"
              name="user"
              type="email"
              placeholder="seu-email@dominio.com"
              value={emailConfig.user}
              onChange={handleChange}
            />

            <Input 
              label="Senha de App ou Token"
              name="password"
              type="password"
              placeholder="••••••••••••"
              value={emailConfig.password}
              onChange={handleChange}
            />

            <div className="pt-4">
              <button 
                type="submit"
                className="w-full md:w-auto px-8 bg-brand-purple py-4 rounded-xl font-bold text-white hover:bg-brand-accent transition-all shadow-lg shadow-brand-purple/20"
              >
                Salvar e Conectar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}