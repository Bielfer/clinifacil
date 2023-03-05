import DescriptionList from '@/components/core/DescriptionList';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import MyLink from '@/components/core/MyLink';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import { showHandbookField } from '@/constants/handbook-fields';
import paths, { patientDetailsPaths, sidebarPaths } from '@/constants/paths';
import { useActiveAppointment, useActiveDoctor, useRoles } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import type { FieldValue } from '@/types/handbook';
import { ArrowRightCircleIcon, PlusIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Url } from 'url';

const PatientAppointments: Page = () => {
  const patientId = useRouter().query.patientId as string;
  const { isDoctor } = useRoles();
  const { data: doctor } = useActiveDoctor();
  const { data: appointments, isLoading } =
    trpc.detailedAppointment.getMany.useQuery(
      {
        doctorId: doctor?.id,
        patientId: parseInt(patientId, 10),
        orderBy: { realizationDate: 'desc' },
      },
      { enabled: !!doctor && !!patientId }
    );
  const { data: activeAppointment, isLoading: isLoadingAppointment } =
    useActiveAppointment({ patientId: parseInt(patientId, 10) });

  const activeAppointmentHandbooks =
    activeAppointment && activeAppointment.handbooks;
  const appointmentHasHandbook =
    activeAppointmentHandbooks && activeAppointmentHandbooks.length > 0;

  let href: string | Partial<Url>;

  if (!activeAppointment)
    href = {
      pathname: paths.newPatientAppointment(patientId),
      query: { onSubmitRedirectUrl: paths.patientHandbooks(patientId) },
    };
  else if (appointmentHasHandbook) href = paths.patientHandbooks(patientId);
  else href = paths.newPatientHandbook(patientId);

  return (
    <>
      <Head>
        <title>CliniFácil | Suas Consultas com o Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <div className="flex items-center justify-between pb-2">
          <Text h2>Suas Consultas com o Paciente</Text>
          {isDoctor && (
            <MyLink
              href={href}
              variant="button-primary"
              iconLeft={
                appointmentHasHandbook ? ArrowRightCircleIcon : PlusIcon
              }
              isLoading={isLoadingAppointment}
            >
              {appointmentHasHandbook
                ? 'Continuar Atendimento'
                : 'Nova Consulta'}
            </MyLink>
          )}
        </div>
        <TabsNavigation tabs={patientDetailsPaths({ patientId })} />
        <LoadingWrapper loading={isLoading}>
          <>
            <Text h3 className="my-4">
              {activeAppointment?.patient.name}
            </Text>
            <div className="gap-y-5 divide-y divide-gray-300">
              {appointments?.map((appointment) => (
                <div key={appointment.id} className="mt-6 first:mt-0">
                  <div className="my-4 flex items-center justify-between">
                    <Text h4>
                      Dia {format(appointment.realizationDate, 'dd/MM/yyyy')}
                    </Text>
                  </div>
                  <div className="flex flex-col gap-y-8">
                    <div className="px-2 sm:px-4">
                      {appointment.handbooks.map((handbook) => (
                        <DescriptionList
                          key={handbook.id}
                          title={handbook.title}
                          items={handbook.fields
                            .map(({ label, value, type }) => ({
                              label,
                              value: showHandbookField({
                                field: type,
                                value: value as FieldValue,
                              }),
                            }))
                            .filter((item) => !!item.value)}
                        />
                      ))}
                      {appointment.prescriptions &&
                        appointment.prescriptions.length > 0 && (
                          <DescriptionList
                            title="Remédios"
                            items={appointment.prescriptions.map(
                              (doctorNote) => ({
                                label: doctorNote.medicationName,
                                value: doctorNote.instructions,
                              })
                            )}
                          />
                        )}
                      {appointment.exams && appointment.exams.length > 0 && (
                        <DescriptionList
                          title="Exames"
                          items={appointment.exams.map((doctorNote) => ({
                            label: doctorNote.name,
                          }))}
                        />
                      )}
                      {appointment.doctorNotes &&
                        appointment.doctorNotes.length > 0 && (
                          <DescriptionList
                            title="Atestados"
                            items={appointment.doctorNotes.map(
                              (doctorNote) => ({
                                label: `Atestado de ${doctorNote.duration} dias`,
                              })
                            )}
                          />
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};

PatientAppointments.allowHigherOrEqualRole = 'DOCTOR';
PatientAppointments.auth = 'block';

export default PatientAppointments;
