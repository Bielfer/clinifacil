import { adminFirestore } from '@/services/firebase/admin';
import { Appointment } from '@/types/appointment';

export const addAppointment = (data: Appointment) =>
  adminFirestore.collection('appointments').add(data);

export const deleteAppointment = (appointmentId: string) =>
  adminFirestore.collection('appointments').doc(appointmentId).delete();
