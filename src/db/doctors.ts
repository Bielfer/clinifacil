import { adminFirestore, getServerTimestamp } from '@/services/firebase/admin';
import { Doctor } from '@/types/doctor';

export const addDoctor = (data: Doctor) =>
  adminFirestore.collection('doctors').add({
    ...data,
    updatedAt: getServerTimestamp(),
  });

export const updateDoctor = (doctorId: string, data: Doctor) =>
  adminFirestore
    .collection('doctors')
    .doc(doctorId)
    .update({
      ...data,
      updatedAt: getServerTimestamp(),
    });
