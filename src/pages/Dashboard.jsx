import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import {
  subscribeToUserHabits,
  createHabit,
  updateHabit,
  toggleHabitCompletion,
  deleteHabit,
} from '../services/habitsService';
import StatsOverview from '../components/StatsOverview';
import HabitCard from '../components/HabitCard';
import HabitModal from '../components/HabitModal';
import { Plus, Search, Filter, Sparkles, Loader2 } from 'lucide-react';

const CATEGORIES = ['Todas', 'Saúde', 'Estudos', 'Produtividade', 'Fitness', 'Finanças', 'Geral'];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estados de Filtro e Busca
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // Escuta os hábitos em tempo real do Firestore para o usuário atual
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = subscribeToUserHabits(
      currentUser.uid,
      (userHabits) => {
        setHabits(userHabits);
        setLoading(false);
      },
      (_err) => {
        setError('Não foi possível carregar os hábitos.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Abertura do modal para criação
  function handleOpenCreate() {
    setEditingHabit(null);
    setIsModalOpen(true);
  }

  // Abertura do modal para edição
  function handleOpenEdit(habit) {
    setEditingHabit(habit);
    setIsModalOpen(true);
  }

  // Salvamento (criar ou atualizar)
  async function handleSaveHabit(habitData) {
    if (editingHabit) {
      await updateHabit(editingHabit.id, habitData);
    } else {
      await createHabit(currentUser.uid, habitData);
    }
  }

  // Alternar conclusão
  async function handleToggle(habitId, currentStatus) {
    await toggleHabitCompletion(habitId, currentStatus);
  }

  // Excluir hábito
  async function handleDelete(habitId) {
    await deleteHabit(habitId);
  }

  // Filtragem dos hábitos
  const filteredHabits = habits.filter((habit) => {
    // Filtro de busca textual
    const matchesSearch =
      habit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (habit.notes && habit.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filtro de status
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'completed'
        ? habit.completed
        : !habit.completed;

    // Filtro de categoria
    const matchesCategory =
      categoryFilter === 'Todas' ? true : habit.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const userName =
    currentUser?.displayName || currentUser?.email?.split('@')[0] || 'você';

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Cabeçalho de Boas-Vindas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <span>Olá, {userName}!</span>
            <span className="inline-block animate-bounce">👋</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aqui está o resumo dos seus hábitos pessoais hoje.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Novo Hábito</span>
        </button>
      </div>

      {/* Cartões de Métricas */}
      <StatsOverview habits={habits} />

      {/* Barra de Filtros e Busca */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Buscar hábitos por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Abas de Status */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({habits.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pendentes
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'completed'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Concluídos
            </button>
          </div>
        </div>

        {/* Categorias (Pills) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs scrollbar-none">
          <span className="text-slate-400 flex items-center gap-1 mr-1 text-[11px] font-medium shrink-0">
            <Filter className="w-3 h-3" /> Categorias:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors shrink-0 cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Hábitos */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
          <p className="text-xs font-medium">Carregando seus hábitos...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl text-center">
          {error}
        </div>
      ) : filteredHabits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggle={handleToggle}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : habits.length === 0 ? (
        /* Estado vazio inicial */
        <div className="text-center py-14 px-4 bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            Nenhum hábito cadastrado ainda
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Comece cadastrando sua primeira rotina diária para acompanhar sua evolução pessoal.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Meu Primeiro Hábito</span>
          </button>
        </div>
      ) : (
        /* Estado vazio após busca/filtro */
        <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">
            Nenhum hábito corresponde aos filtros
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Tente buscar com outro termo ou selecione todas as categorias.
          </p>
        </div>
      )}

      {/* Modal de Criação / Edição */}
      <HabitModal
        key={editingHabit ? editingHabit.id : 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHabit}
        initialData={editingHabit}
      />
    </main>
  );
}
