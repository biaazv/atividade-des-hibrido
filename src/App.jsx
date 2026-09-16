import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/useAuth';
import Navbar from './components/Navbar';
import FirebaseBanner from './components/FirebaseBanner';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { Loader2 } from 'lucide-react';

function MainContent() {
  const { currentUser, isFirebaseConfigured, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-medium">Carregando HabitFlow...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Banner de aviso caso o .env não esteja configurado */}
      {!isFirebaseConfigured && <FirebaseBanner />}

      {/* Se o usuário estiver autenticado, exibe Navbar + Dashboard */}
      {currentUser ? (
        <>
          <Navbar />
          <div className="flex-1">
            <Dashboard />
          </div>
        </>
      ) : (
        /* Caso contrário, exibe as telas de Login ou Cadastro */
        <div className="flex-1 flex flex-col justify-center">
          {authView === 'login' ? (
            <Login onSwitchToRegister={() => setAuthView('register')} />
          ) : (
            <Register onSwitchToLogin={() => setAuthView('login')} />
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
