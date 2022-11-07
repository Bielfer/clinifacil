import { useToast } from '@/components/core/Toast';
import { auth } from '@/services/firebase';
import { actionCodeSettings } from '@/services/firebase/auth';
import tryCatch from '@/helpers/tryCatch';
import {
  EmailAuthProvider,
  isSignInWithEmailLink,
  linkWithCredential,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut as signOutFirebase,
  updateProfile,
  User,
} from 'firebase/auth';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface Context {
  userAuth?: User | null;
  sendEmailLink: (email: string, url?: string) => Promise<void>;
  signInEmailLink: () => Promise<void>;
  signInEmailAndPassword: (email: string, password: string) => Promise<boolean>;
  signInAnonymous: (user: {
    displayName?: string;
    photoUrl?: string;
  }) => Promise<void>;
  linkAnonymousToEmailLink: (email: string) => Promise<void>;
  loggedIn: boolean;
  loading: boolean;
  signOut: () => void;
}

const AuthContext = createContext({} as Context);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { addToast } = useToast();
  const [userAuth, setUserAuth] = useState<User | null>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUserAuth(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const sendEmailLink = useCallback(
    async (email: string, url = '') => {
      const [, error] = await tryCatch(
        sendSignInLinkToEmail(auth, email, {
          ...actionCodeSettings,
          url: actionCodeSettings.url + url,
        })
      );

      if (error) {
        addToast({
          type: 'error',
          content: 'Erro ao enviar link para email',
        });
      }

      window.localStorage.setItem('presentin-sign-in-email', email);
    },
    [addToast]
  );

  const signInEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      const [token, error] = await tryCatch(
        signInWithEmailAndPassword(auth, email, password)
      );

      if (error) return false;

      setUserAuth(token?.user);
      return true;
    },

    [addToast]
  );

  const signInEmailLink = useCallback(async () => {
    if (!isSignInWithEmailLink(auth, window.location.href)) return;

    let email = window.localStorage.getItem('presentin-sign-in-email');

    if (!email) {
      email = window.prompt(
        'Insira o email novamente para confirmarmos sua identidade'
      );
    }

    const [, error] = await tryCatch(
      signInWithEmailLink(auth, email ?? '', window.location.href)
    );

    if (error)
      addToast({
        type: 'error',
        content:
          'Seu email pode estar diferente do email digitado anteriormente ou seu link expirou. Favor tente fazer o login novamente',
      });

    window.localStorage.removeItem('presentin-sign-in-email');
  }, [addToast]);

  const signInAnonymous = useCallback(
    async (user?: { displayName?: string; photoUrl?: string }) => {
      const [token, error] = await tryCatch(signInAnonymously(auth));

      if (!token || error) {
        addToast({
          type: 'warning',
          content: 'Houve um pequeno erro, clique de novo em criar',
        });
        return;
      }

      if (user && auth.currentUser) updateProfile(auth.currentUser, user);

      setUserAuth(token.user);
    },
    [addToast]
  );

  const linkAnonymousToEmailLink = useCallback(
    async (email: string) => {
      const credential = EmailAuthProvider.credentialWithLink(
        email,
        window.location.href
      );

      if (!auth.currentUser) {
        addToast({ type: 'error', content: 'Falha ao linkar usuário' });
        return;
      }

      const [token, error] = await tryCatch(
        linkWithCredential(auth.currentUser, credential)
      );

      if (!token || error) {
        addToast({ type: 'error', content: 'Falha ao linkar usuário' });
        return;
      }

      setUserAuth(token.user as any);
    },
    [addToast]
  );

  const signOut = () => signOutFirebase(auth);

  const value = useMemo(
    () => ({
      userAuth,
      sendEmailLink,
      signInEmailLink,
      signInAnonymous,
      linkAnonymousToEmailLink,
      loggedIn: !!userAuth,
      loading: userAuth === undefined,
      signOut,
      signInEmailAndPassword,
    }),
    [
      signInEmailLink,
      userAuth,
      sendEmailLink,
      signInAnonymous,
      linkAnonymousToEmailLink,
      signInEmailAndPassword,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
