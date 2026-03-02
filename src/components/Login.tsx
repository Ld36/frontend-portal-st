'use client';

import { useState } from 'react';
import { api } from '@/services/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { ShieldCheck, Loader2 } from 'lucide-react';

export function Login({ onLoginSuccess }: { onLoginSuccess: (name: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, name } = response.data;

      localStorage.setItem('portal_st_token', access_token);
      onLoginSuccess(name || 'Administrador');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Falha na autenticação administrativa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-blue-600">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto text-blue-600 mb-2" size={40} />
          <CardTitle>Acesso Administrativo</CardTitle>
          <CardDescription>Use suas credenciais JWT para gerenciar homologações.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
          <Button onClick={handleLogin} className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Entrar no Sistema"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}