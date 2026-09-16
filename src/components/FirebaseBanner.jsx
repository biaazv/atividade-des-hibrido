import { AlertTriangle, KeyRound, ExternalLink } from 'lucide-react';

export default function FirebaseBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-amber-900">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-amber-800">
              Firebase ainda não configurado no arquivo <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env</code>!
            </p>
            <p className="text-amber-700 mt-0.5">
              Preencha as chaves do Firebase Console para habilitar autenticação e banco de dados Firestore.
            </p>
          </div>
        </div>

        <a
          href="https://console.firebase.google.com"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg shadow-xs transition-colors shrink-0"
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Abrir Console</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      </div>
    </div>
  );
}
