'use client';

import { LayoutDashboard, Factory, Search, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: any) => void;
  isAdmin: boolean;
}

export function Sidebar({ currentView, onViewChange, isAdmin }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col border-r border-slate-800 shadow-2xl">
      <div className="mb-8 p-2 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShieldCheck className="text-blue-500" /> Portal ST
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Menu Externo</div>
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start gap-2", currentView === 'form' && "bg-slate-800 text-blue-400")}
          onClick={() => onViewChange('form')}
        >
          <Factory size={18} /> Cadastro de Empresa
        </Button>
        <Button 
          variant="ghost" 
          className={cn("w-full justify-start gap-2", currentView === 'status' && "bg-slate-800 text-blue-400")}
          onClick={() => onViewChange('status')}
        >
          <Search size={18} /> Consultar Status
        </Button>

        {/* Link para Access Admin - sempre visível */}
        <div className="pt-6">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Administração</div>
          <Button 
            variant="ghost" 
            className={cn("w-full justify-start gap-2", currentView === 'admin' && "bg-slate-800 text-blue-400")}
            onClick={() => onViewChange('admin')}
          >
            <LayoutDashboard size={18} /> {isAdmin ? 'Empresas' : 'Login Admin'}
          </Button>
        </div>

        {/* Se já está logado como admin, mostra opções extras */}
      </nav>

      <div className="mt-auto p-4 bg-slate-800/50 rounded-lg">
        <p className="text-xs text-slate-400 italic">Security Mode: AES-256 Enabled</p>
      </div>
    </aside>
  );
}