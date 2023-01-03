import create from 'zustand';

type ReceptionistState = {
  selectedDoctorId?: number;
  setSelectedDoctorId: (doctorId: number) => void;
};

const useReceptionistStore = create<ReceptionistState>((set) => ({
  selectedDoctorId: undefined,
  setSelectedDoctorId: (doctorId: number) =>
    set({ selectedDoctorId: doctorId }),
}));

export default useReceptionistStore;
