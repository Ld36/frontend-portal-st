'use client';

import { useState } from 'react';
import { CompanyForm } from '../components/CompanyForm';
import { Dashboard } from '../components/Dashboard';
import { Button } from '@/components/ui/button';
import { setAuthType } from '@/services/api';

export default function Home() {
  const [view, setView] = useState<'user' | 'admin'>('user');

  const toggleView = (newView: 'user' | 'admin') => {
    setView(newView);
    // Ajusta o header para o backend entender o ator
    setAuthType(newView === 'admin' ? 'interno' : 'externo');
  };

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border">
          <h1 className="text-xl font-bold text-slate-800">Portal de Serviços ST</h1>
          <nav className="flex gap-2">
            <Button 
              variant={view === 'user' ? 'default' : 'outline'} 
              onClick={() => toggleView('user')}
            >
              Novo Cadastro
            </Button>
            <Button 
              variant={view === 'admin' ? 'default' : 'outline'} 
              onClick={() => toggleView('admin')}
            >
              Painel Admin
            </Button>
          </nav>
        </header>

        <section className="mt-8">
          {view === 'user' ? <CompanyForm /> : <Dashboard />}
        </section>
      </div>
    </main>
  );
}