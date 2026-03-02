'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { CompanyForm } from '@/components/CompanyForm';
import { Dashboard } from '@/components/Dashboard';
import { Login } from '@/components/Login';
import { StatusCheck } from '@/components/StatusCheck'; // Importe o componente novo
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Rocket, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

function HomeContent() {

  // 'landing' é a nossa Landing Page inicial exigida pelo PDF
  const [view, setView] = useState<'landing' | 'form' | 'admin' | 'status'>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem('portal_st_token');
    if (token) setIsAuthenticated(true);
    
    // Verifica se tem o parâmetro z_admin na URL
    if (searchParams.get('z_admin') === 'true') {
      setView('admin');
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const handleViewChange = (newView: any) => {
    setView(newView);
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center">Carregando...</div>;

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* A Sidebar agora é GLOBAL, ela nunca some */}
      <Sidebar
        currentView={view}
        onViewChange={handleViewChange}
        isAdmin={isAuthenticated}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />
      
      <main className="flex-1 p-3 md:p-8 overflow-y-auto md:ml-0">
        <div className="md:hidden mb-3">
          <Button variant="outline" size="icon" onClick={() => setMobileSidebarOpen(true)}>
            <Menu size={18} />
          </Button>
        </div>
        <div className="max-w-6xl mx-auto">
          
          {/* VISÃO: Landing Page (Menu Inicial do PDF) */}
          {view === 'landing' && (
            <div className="text-center py-10 space-y-8">
              <h1 className="text-4xl font-extrabold text-slate-900">Bem-vindo ao Portal - ST</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-xl cursor-pointer transition-all border-b-4 border-b-blue-600" onClick={() => setView('form')}>
                  <CardHeader>
                    <Rocket className="w-12 h-12 text-blue-600 mb-2" />
                    <CardTitle>Nova Empresa</CardTitle>
                    <CardDescription>Clique para iniciar seu cadastro externo.</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="hover:shadow-xl cursor-pointer transition-all border-b-4 border-b-green-600" onClick={() => setView('status')}>
                  <CardHeader>
                    <Search className="w-12 h-12 text-green-600 mb-2" />
                    <CardTitle>Consultar Status</CardTitle>
                    <CardDescription>Acompanhe sua aprovação em tempo real.</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )}

          {/* VISÃO: Formulário de Cadastro */}
          {view === 'form' && <CompanyForm onSuccess={() => setView('status')} />}
          
          {/* VISÃO: Status Check */}
          {view === 'status' && <StatusCheck />}

          {/* VISÃO: Painel Admin */}
          {view === 'admin' && (
            !isAuthenticated ? (
              <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            ) : (
              <Dashboard onAddNew={() => setView('form')} onLogout={() => {
                localStorage.removeItem('portal_st_token');
                setIsAuthenticated(false);
                setView('landing');
              }} />
            )
          )}

        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando...</div>}>
      <HomeContent />
    </Suspense>
  );
}