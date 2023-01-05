import { useRouter } from 'next/router';

const Page403 = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col bg-white pt-16 pb-12">
      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Erro 403
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              Não Autorizado.
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Você não possui permissão para acessar esse conteúdo!
            </p>
            <div className="mt-6">
              <button
                className="text-base font-medium text-primary-600 hover:text-primary-500"
                type="button"
                onClick={() => router.back()}
              >
                Voltar para página anterior
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page403;
