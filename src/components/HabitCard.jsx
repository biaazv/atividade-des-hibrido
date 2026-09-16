import { useState } from 'react';
import { Check, Trash2, Edit3, Calendar, FileText, Loader2 } from 'lucide-react';

const CATEGORY_COLORS = {
  Saúde: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Estudos: 'bg-purple-50 text-purple-700 border-purple-200',
  Produtividade: 'bg-blue-50 text-blue-700 border-blue-200',
  Fitness: 'bg-amber-50 text-amber-700 border-amber-200',
  Finanças: 'bg-teal-50 text-teal-700 border-teal-200',
  Geral: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function HabitCard({ habit, onToggle, onEdit, onDelete }) {
  const [loadingToggle, setLoadingToggle] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const categoryClass = CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.Geral;

  async function handleToggle() {
    try {
      setLoadingToggle(true);
      await onToggle(habit.id, habit.completed);
    } finally {
      setLoadingToggle(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Tem certeza que deseja excluir o hábito "${habit.title}"?`)) {
      return;
    }
    try {
      setLoadingDelete(true);
      await onDelete(habit.id);
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <div
      className={`group bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 ${
        habit.completed
          ? 'border-emerald-200 bg-emerald-50/20 shadow-xs'
          : 'border-slate-200 hover:border-indigo-200 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Checkbox button & Title */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            onClick={handleToggle}
            disabled={loadingToggle}
            aria-label={habit.completed ? 'Marcar como não feito' : 'Marcar como feito'}
            className={`mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              habit.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                : 'border-slate-300 hover:border-indigo-500 bg-white'
            }`}
          >
            {loadingToggle ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
            ) : habit.completed ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : null}
          </button>

          <div className="min-w-0 flex-1">
            <h3
              className={`text-base font-semibold transition-all break-words ${
                habit.completed
                  ? 'line-through text-slate-400'
                  : 'text-slate-800'
              }`}
            >
              {habit.title}
            </h3>

            {habit.notes && (
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">{habit.notes}</span>
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${categoryClass}`}
              >
                {habit.category || 'Geral'}
              </span>

              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {habit.frequency || 'Diário'}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(habit)}
            title="Editar hábito"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            disabled={loadingDelete}
            title="Excluir hábito"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            {loadingDelete ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
