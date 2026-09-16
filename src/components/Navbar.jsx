import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { LogOut, CheckCircle2, Loader2 } from 'lucide-react';


export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    } finally {
      setLoggingOut(false);
    }
  }

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Usuário';

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-none">HabitFlow</h1>
            <span className="text-xs text-slate-500 font-medium">Controle de Hábitos</span>
          </div>
        </div>

        {/* User profile & Logout */}
        {currentUser && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">
                {displayName}
              </span>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              title="Sair da conta"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors"
            >
              {loggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
