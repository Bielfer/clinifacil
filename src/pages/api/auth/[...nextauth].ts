import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { Session, User } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import { createTransport } from 'nodemailer';
import { prisma } from '@/services/prisma';
import { AdapterUser } from 'next-auth/adapters';

function html(params: { url: string; host: string }) {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, '&#8203;.');

  const brandColor = '#0d9488';
  const color = {
    background: '#f9f9f9',
    text: '#444',
    mainBackground: '#fff',
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: '#fff',
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Faça seu login em: <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Fazer Login</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Se você não solicitou este e-mail, pode ignorá-lo com segurança.
      </td>
    </tr>
  </table>
</body>
`;
}

function text({ url, host }: { url: string; host: string }) {
  return `Faça seu login em ${host}\n${url}\n\n`;
}

async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: {
  url: string;
  identifier: string;
  provider: any;
}) {
  const { host } = new URL(url);
  const transport = createTransport(provider.server);
  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Faça seu login em: ${host}`,
    text: text({ url, host }),
    html: html({ url, host }),
  });
  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest,
    }),
  ],
  callbacks: {
    session: async ({
      session,
      user,
    }: {
      session: Session;
      user: User | AdapterUser;
    }) => {
      const sessionCopy: Session = {
        ...session,
      };

      sessionCopy.user = user;

      return sessionCopy;
    },
  },
};

export default NextAuth(authOptions);
