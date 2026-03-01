import './globals.css';
import { Toaster } from "../components/ui/toaster";

export const metadata = {
  title: 'Portal ST - Cadastro',
  description: 'Sistema de cadastro de empresas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}