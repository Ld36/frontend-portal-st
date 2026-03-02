'use client';

import { LayoutDashboard, Factory, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  isAdmin: boolean;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function Sidebar({ currentView, onViewChange, isAdmin, mobileOpen = false, onCloseMobile }: SidebarProps) {
  const handleChangeView = (view: any) => {
    onViewChange(view);
    onCloseMobile?.();
  };

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={onCloseMobile} />}
      <aside
        className={`
          fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white p-4 flex flex-col border-r border-slate-800 shadow-2xl
          transform transition-transform duration-200 md:static md:h-auto md:min-h-screen md:translate-x-0 md:w-64
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
      <div className="mb-6 md:mb-8 p-2 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center justify-center md:justify-start gap-2">
          <ShieldCheck className="text-blue-500" />
          <span>Portal ST</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu Externo</div>
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start gap-2 px-3", currentView === 'form' && "bg-slate-800 text-blue-400")}
          onClick={() => handleChangeView('form')}
        >
          <Factory size={18} />
          <span>Cadastro de Empresa</span>
        </Button>
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start gap-2 px-3", currentView === 'status' && "bg-slate-800 text-blue-400")}
          onClick={() => handleChangeView('status')}
        >
          <Search size={18} />
          <span>Consultar Status</span>
        </Button>

        {/* Link para Access Admin - sempre visível */}
        <div className="pt-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Administração</div>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start gap-2 px-3", currentView === 'admin' && "bg-slate-800 text-blue-400")}
            onClick={() => handleChangeView('admin')}
          >
            <LayoutDashboard size={18} />
            <span>{isAdmin ? 'Empresas' : 'Login Admin'}</span>
          </Button>
        </div>

        {/* Se já está logado como admin, mostra opções extras */}
      </nav>

      <div className="mt-auto p-4 bg-slate-800/50 rounded-lg">
        <p className="text-xs text-slate-400 italic">Security Mode: AES-256 Enabled</p>
      </div>
      </aside>
    </>
  );
}