import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';

export function useFirebaseCollection<T extends { id?: string; invoice?: string; }>(collectionName: string, defaultData: T[]) {
  const [data, setData] = useState<T[]>(defaultData);

  useEffect(() => {
    const collRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(collRef, (snapshot) => {
      try {
        if (!snapshot.empty) {
          const fetchedData = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as unknown as T));
          setData(fetchedData);
        } else {
          // Sync default data to Firebase if empty
          defaultData.forEach(item => {
            const id = item.id || item.invoice || Math.random().toString(36).substr(2, 9);
            setDoc(doc(db, collectionName, id), item).catch(e => console.error("Firebase sync error:", e));
          });
          setData(defaultData);
        }
      } catch (err) {
        console.error("Firebase fetch error", err);
      }
    }, (error) => {
      console.error("Firebase onSnapshot error:", error);
    });

    return () => unsubscribe();
  }, [collectionName]); // eslint-disable-line

  const setFirebaseData = (action: React.SetStateAction<T[]>) => {
    setData((prev) => {
       const nextState = typeof action === 'function' ? (action as Function)(prev) : action;
       
       // Perform the writes to Firebase seamlessly
       nextState.forEach((item: T) => {
          const id = item.id || item.invoice;
          if (id) {
            setDoc(doc(db, collectionName, id), item).catch(e => console.error("Firebase update error:", e));
          }
       });
       
       // Handle deletions: if an item in prev is not in nextState, delete it
       prev.forEach((item: T) => {
         const oldId = item.id || item.invoice;
         if (oldId && !nextState.find(n => (n.id || n.invoice) === oldId)) {
            deleteDoc(doc(db, collectionName, oldId)).catch(e => console.error("Firebase delete error:", e));
         }
       });
       
       return nextState;
    });
  };

  return [data, setFirebaseData] as const;
}
