import { adminFirestore } from '@/services/firebase/admin';
import { Receptionist } from '@/types/receptionist';

export const getReceptionistById = (id: string) =>
  adminFirestore.collection('receptionists').doc(id).get();

export const addReceptionist = (data: Receptionist) =>
  adminFirestore.collection('receptionists').add(data);

export const updateReceptionist = (id: string, data: Receptionist) =>
  adminFirestore.collection('receptionists').doc(id).update(data);
