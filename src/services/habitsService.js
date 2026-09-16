import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const COLLECTION_NAME = 'habits';

/**
 * Escuta em tempo real os hábitos pertencentes exclusivamente ao usuário logado (userId)
 */
export function subscribeToUserHabits(userId, onUpdate, onError) {
  if (!db || !userId) {
    onUpdate([]);
    return () => {};
  }

  // Consulta filtrando estritamente pelo UID do usuário autenticado
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const habits = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      // Ordena por data de criação decrescente no cliente (evita necessidade de índices compostos manuais)
      habits.sort((a, b) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.createdAt || 0);
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.createdAt || 0);
        return timeB - timeA;
      });

      onUpdate(habits);
    },
    (error) => {
      console.error('Erro ao ouvir hábitos do Firestore:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Cria um novo hábito vinculado ao UID do usuário
 */
export async function createHabit(userId, habitData) {
  if (!db || !userId) throw new Error('Banco de dados ou usuário não disponível');

  const newHabit = {
    userId,
    title: habitData.title.trim(),
    category: habitData.category || 'Geral',
    frequency: habitData.frequency || 'Diário',
    targetDays: habitData.targetDays || 1,
    notes: habitData.notes || '',
    completed: false,
    completedDates: [],
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), newHabit);
  return docRef.id;
}

/**
 * Alterna o status de conclusão do hábito
 */
export async function toggleHabitCompletion(habitId, currentStatus) {
  if (!db) throw new Error('Banco de dados não disponível');

  const habitRef = doc(db, COLLECTION_NAME, habitId);
  const today = new Date().toISOString().split('T')[0];

  await updateDoc(habitRef, {
    completed: !currentStatus,
    lastCompletedDate: !currentStatus ? today : null,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Atualiza os dados de um hábito existente
 */
export async function updateHabit(habitId, habitData) {
  if (!db) throw new Error('Banco de dados não disponível');

  const habitRef = doc(db, COLLECTION_NAME, habitId);
  await updateDoc(habitRef, {
    title: habitData.title.trim(),
    category: habitData.category,
    frequency: habitData.frequency,
    notes: habitData.notes || '',
    updatedAt: serverTimestamp(),
  });
}

/**
 * Exclui um hábito
 */
export async function deleteHabit(habitId) {
  if (!db) throw new Error('Banco de dados não disponível');

  const habitRef = doc(db, COLLECTION_NAME, habitId);
  await deleteDoc(habitRef);
}
