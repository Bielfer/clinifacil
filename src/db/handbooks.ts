import { adminFirestore } from '@/services/firebase/admin';
import { Handbook } from '@/types/handbook';

export const getHandbookById = (handbookId: string) =>
  adminFirestore.collection('handbooks').doc(handbookId).get();

export const addHandbook = (data: Handbook) => {
  const { id, ...dataWithoutId } = data;

  return adminFirestore.collection('handbooks').add(dataWithoutId);
};

export const deleteHandbook = (handbookId: string) =>
  adminFirestore.collection('handbooks').doc(handbookId).delete();
