import { adminFirestore } from '@/services/firebase/admin';
import { Appointment } from '@/types/appointment';

export const getAppointments = (
  queryParams: Partial<{
    [key: string]: string | string[];
  }>
) => {
  let appointments: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
    adminFirestore.collection('appointments');

  Object.entries(queryParams).forEach(([key, value]) => {
    appointments = appointments.where(key, '==', value);
  });

  return appointments.get();
};

export const addAppointment = (data: Appointment) =>
  adminFirestore.collection('appointments').add(data);

export const deleteAppointment = (appointmentId: string) =>
  adminFirestore.collection('appointments').doc(appointmentId).delete();
