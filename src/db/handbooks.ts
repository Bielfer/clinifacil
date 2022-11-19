import { adminFirestore } from '@/services/firebase/admin';
import { Handbook } from '@/types/handbook';

export const setHandbook = (data: Handbook) => {
  const { id, ...dataWithoutId } = data;

  return adminFirestore.collection('handbooks').doc(id).set(dataWithoutId);
};

export const deleteHandbook = (handbookId: string) =>
  adminFirestore.collection('handbooks').doc(handbookId).delete();
