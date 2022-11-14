import { adminFirestore, getServerTimestamp } from '@/services/firebase/admin';
import { Patient } from '@/types/patient';

export const addPatient = (data: Patient) =>
  adminFirestore.collection('patients').add({
    ...data,
    updatedAt: getServerTimestamp(),
  });

export const updatePatient = (id: string, data: Patient) =>
  adminFirestore
    .collection('patients')
    .doc(id)
    .update({
      ...data,
      updatedAt: getServerTimestamp(),
    });
