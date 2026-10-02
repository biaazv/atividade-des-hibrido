import { useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { formatAuthError } from '../contexts/authHelpers';
import { KeyRound, Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword({ onSwitchToLogin, initialEmail = '' }) {
  const { resetPassword, isFirebaseConfigured } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, informe o seu e-mail cadastrado.');
      return;
    }

    try {
      setError('');
      setSuccess(false);
      setLoading(true);
      await resetPassword(email.trim());
      setSuccess(true);
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
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Recuperar Senha</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Informe o e-mail da sua conta para receber um link de redefinição
          </p>
        </div>

        {/* Mensagem de sucesso */}
        {success && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-emerald-900">E-mail enviado com sucesso!</p>
              <p className="mt-0.5 text-emerald-700">
                Verifique a caixa de entrada (e a pasta de spam) de <strong>{email}</strong> e siga o link para redefinir sua senha.
              </p>
            </div>
          </div>
        )}

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
              E-mail da Conta *
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
                autoFocus
              />
            </div>
          </div>

          {/* Botão de Enviar */}
          <button
            type="submit"
            disabled={loading || !isFirebaseConfigured}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <KeyRound className="w-5 h-5" />
            )}
            <span>{loading ? 'Enviando link...' : 'Enviar Link de Redefinição'}</span>
          </button>
        </form>

        {/* Rodapé com botão de voltar ao login */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <button
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a tela de login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
