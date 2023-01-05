import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';

const NoDoctorSelectedMessage = () => (
  <div className="text-center">
    <CursorArrowRaysIcon className="mx-auto h-12 w-12 text-gray-400" />
    <h3 className="mt-2 text-sm font-medium text-gray-900">
      Nenhum médico selecionado
    </h3>
    <p className="mt-1 text-sm text-gray-500">
      Para selecionar um médico basta clicar no seletor acima
    </p>
  </div>
);

export default NoDoctorSelectedMessage;
