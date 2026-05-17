import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, doc, onSnapshot, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { generateId } from '../utils/storage';
import { getDateKey } from '../utils/streaks';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const { user } = useAuth();
  
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ─── Synchronize Cloud Data ───────────────────
  useEffect(() => {
    if (!user || !db) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userRef = doc(db, 'users', user.uid);
    const unsubs = [];
    
    // Binds a real-time WebSocket to Firebase NoSQL Collections
    const bindCollection = (colName, setter) => {
       const colRef = collection(userRef, colName);
       return onSnapshot(colRef, (snapshot) => {
         const data = snapshot.docs.map(d => d.data());
         setter(data);
       }, (err) => console.log(`Firestore Sync Error [${colName}]:`, err));
    };

    unsubs.push(bindCollection('expenses', (data) => setExpenses(data.sort((a,b) => new Date(b.date) - new Date(a.date)))));

    setIsLoading(false);

    return () => unsubs.forEach(u => u());
  }, [user]);

  // ─── Core Cloud Mutators ──────────────────────
  const _addDoc = async (colName, data) => {
    if (!user || !db) return;
    const id = generateId();
    await setDoc(doc(db, 'users', user.uid, colName, id), { ...data, id });
  };

  const _updateDoc = async (colName, id, updates) => {
    if (!user || !db) return;
    await updateDoc(doc(db, 'users', user.uid, colName, id), updates);
  };

  const _deleteDoc = async (colName, id) => {
    if (!user || !db) return;
    await deleteDoc(doc(db, 'users', user.uid, colName, id));
  };

  // ─── Expenses ────────────────────────────────
  const addExpense = (expense) => _addDoc('expenses', { ...expense, date: expense.date || getDateKey() });
  const updateExpense = (id, updates) => _updateDoc('expenses', id, updates);
  const deleteExpense = (id) => _deleteDoc('expenses', id);

  // ─── State Payload ────────────────────────────
  const value = {
    isLoading,
    expenses, addExpense, updateExpense, deleteExpense,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export default AppContext;
