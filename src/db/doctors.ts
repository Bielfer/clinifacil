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

export const addHandbookToDoctor = (doctorId: string, handbookId: string) =>
  adminFirestore.runTransaction(async (transaction) => {
    const handbookRef = adminFirestore.collection('handbooks').doc(handbookId);
    const handbookDoc = await transaction.get(handbookRef);

    if (!handbookDoc.exists) {
      throw new Error("Document doesn't exist!");
    }

    const handbook = handbookDoc.data();
    const doctorHandbooksRef = adminFirestore
      .collection('doctors')
      .doc(doctorId)
      .collection('handbooks')
      .doc();

    return transaction.create(doctorHandbooksRef, handbook);
  });
