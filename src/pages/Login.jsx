import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { formatAuthError } from '../contexts/authHelpers';
import { LogIn, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';

export default function Login({ onSwitchToRegister, onSwitchToForgotPassword }) {
  const { login, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email.trim(), password);
    } catch (err) {
      console.error(err);
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/50">
        {/* Header com ícone */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-indigo-600 items-center justify-center text-white shadow-lg shadow-indigo-200 mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Entre na sua conta para acessar seus hábitos pessoais
          </p>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* E-mail */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Senha */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Senha
              </label>
              {onSwitchToForgotPassword && (
                <button
                  type="button"
                  onClick={() => onSwitchToForgotPassword(email)}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Botão de Entrar */}
          <button
            type="submit"
            disabled={loading || !isFirebaseConfigured}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span>Entrar</span>
          </button>
        </form>

        {/* Rodapé com link para cadastro */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Ainda não tem uma conta?{' '}
            <button
              onClick={onSwitchToRegister}
              className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
            >
              Cadastre-se gratuitamente
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
