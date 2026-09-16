import { Target, CheckCircle2, TrendingUp } from 'lucide-react';

export default function StatsOverview({ habits }) {
  const total = habits.length;
  const completed = habits.filter((h) => h.completed).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
      {/* Total Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 block">Total de Hábitos</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{total}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Target className="w-5 h-5" />
        </div>
      </div>

      {/* Completed Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs font-medium text-slate-500 block">Concluídos Hoje</span>
          <span className="text-2xl font-bold text-emerald-600 mt-1 block">{completed}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500 block">Progresso do Dia</span>
            <span className="text-2xl font-bold text-indigo-600 mt-1 block">{percentage}%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        {/* Barra de progresso */}
        <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
