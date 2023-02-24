import DescriptionList from '@/components/core/DescriptionList';
import LoadingWrapper from '@/components/core/LoadingWrapper';
import Sidebar from '@/components/core/Sidebar';
import TabsNavigation from '@/components/core/TabsNavigation';
import Text from '@/components/core/Text';
import { toPrintField } from '@/constants/field-types';
import { patientDetailsPaths, sidebarPaths } from '@/constants/paths';
import { useActiveDoctor } from '@/hooks';
import { trpc } from '@/services/trpc';
import { Page } from '@/types/auth';
import { format } from 'date-fns';
import Head from 'next/head';
import { useRouter } from 'next/router';

const PatientAppointments: Page = () => {
  const patientId = useRouter().query.patientId as string;
  const { data: doctor } = useActiveDoctor();
  const { data: appointments, isLoading } =
    trpc.detailedAppointment.getMany.useQuery(
      {
        doctorId: doctor?.id,
        patientId: parseInt(patientId, 10),
        orderBy: { createdAt: 'desc' },
      },
      { enabled: !!doctor && !!patientId }
    );

  return (
    <>
      <Head>
        <title>CliniFácil | Suas Consultas com o Paciente</title>
      </Head>
      <Sidebar items={sidebarPaths}>
        <Text h2 className="pb-2">
          Suas Consultas com o Paciente
        </Text>
        <TabsNavigation tabs={patientDetailsPaths({ patientId })} />
        <LoadingWrapper loading={isLoading}>
          <div className="gap-y-5 divide-y divide-gray-300">
            {appointments?.map((appointment) => (
              <div key={appointment.id} className="mt-6 pt-6 first:mt-0">
                <Text h4 className="my-4">
                  Dia {format(appointment.createdAt, 'dd/MM/yyyy')}
                </Text>
                <div className="flex flex-col gap-y-8">
                  <div className="px-2 sm:px-4">
                    {appointment.handbooks.map((handbook) => (
                      <DescriptionList
                        key={handbook.id}
                        title={handbook.title}
                        items={handbook.fields
                          .map(
                            ({ label, value, type }) =>
                              !!value && {
                                label,
                                value: toPrintField({ field: type, value }),
                              }
                          )
                          .filter((item) => !!item)}
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
                          items={appointment.doctorNotes.map((doctorNote) => ({
                            label: `Atestado de ${doctorNote.duration} dias`,
                          }))}
                        />
                      )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </LoadingWrapper>
      </Sidebar>
    </>
  );
};

PatientAppointments.allowHigherOrEqualRole = 'DOCTOR';
PatientAppointments.auth = 'block';

export default PatientAppointments;
