import { adminFirestore, getDocumentId } from '@/services/firebase/admin';
import { Doctor } from '@/types/doctor';

export const addDoctor = (data: Doctor) =>
  adminFirestore.collection('doctors').add(data);

export const updateDoctor = (doctorId: string, data: Doctor) =>
  adminFirestore.collection('doctors').doc(doctorId).update(data);

export const getDoctorsById = (doctorIds: string[]) =>
  adminFirestore
    .collection('doctors')
    .where(getDocumentId(), 'in', doctorIds)
    .get();
