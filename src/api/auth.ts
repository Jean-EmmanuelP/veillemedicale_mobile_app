import type {
  AuthResponse,
  Credentials,
  OAuthProvider,
  User,
} from '$types/auth.ts';

// Mock data
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: '1',
    password: '1',
    picture:
      '/https://media.licdn.com/dms/image/v2/D4E03AQFjVs8_IjoSkQ/profile-displayphoto-shrink_800_800/B4EZXFCkVsHMAc-/0/1742767540080?e=1749081600&v=beta&t=UHyqr0nuzyRxo83ZAbtDH-rBFM_GBHIFLp09CSf3SAY',
    name: 'Test User',
    isSubscribed: false,
    authMethod: 'email',
    createdAt: new Date().toISOString(),
  },
];

const mockOAuthUsers: User[] = [
  {
    id: 'google-1',
    email: 'john@gmail.com',
    name: 'John Google',
    picture:
      '/https://media.licdn.com/dms/image/v2/D4E03AQFjVs8_IjoSkQ/profile-displayphoto-shrink_800_800/B4EZXFCkVsHMAc-/0/1742767540080?e=1749081600&v=beta&t=UHyqr0nuzyRxo83ZAbtDH-rBFM_GBHIFLp09CSf3SAY',
    isSubscribed: true,
    authMethod: 'google',
    createdAt: new Date().toISOString(),
  },
];

export class AuthService {
  static async signInWithEmail(
    credentials: Credentials,
  ): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => u.email === credentials.email);

        if (!user || user.password !== credentials.password) {
          reject(new Error('Email ou mot de passe incorrect'));
          return;
        }

        const { password, ...userWithoutPassword } = user;
        resolve({
          token: `mock-token-${user.id}`,
          user: userWithoutPassword,
        });
      }, 500); // Simulation d'un délai réseau
    });
  }

  static async signUpWithEmail(
    credentials: Credentials,
  ): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Vérifier si l'utilisateur existe déjà
        if (mockUsers.some((u) => u.email === credentials.email)) {
          reject(new Error('Un compte existe déjà avec cet email'));
          return;
        }

        // Créer un nouvel utilisateur
        const newUser: User & { password: string } = {
          id: `${mockUsers.length + 1}`,
          email: credentials.email,
          password: credentials.password,
          name: credentials.email.split('@')[0], // Nom par défaut
          isSubscribed: false,
          authMethod: 'email',
          createdAt: new Date().toISOString(),
        };

        mockUsers.push(newUser);

        const { password, ...userWithoutPassword } = newUser;
        resolve({
          token: `mock-token-${newUser.id}`,
          user: userWithoutPassword,
        });
      }, 500);
    });
  }

  static async signInWithOAuth(provider: OAuthProvider): Promise<AuthResponse> {
    const user = mockOAuthUsers.find((u) => u.authMethod === provider);
    if (!user) throw new Error('Authentication failed');

    return {
      token: `mock-oauth-token-${user.id}`,
      user,
    };
  }

  static async signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 200);
    });
  }
}
