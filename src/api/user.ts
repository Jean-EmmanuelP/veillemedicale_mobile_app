import type { User } from '$types/auth.ts';

// Simulation d'une base de données en mémoire
let mockUsers: User[] = [
  {
    id: '1',
    email: 'a@gmail.com',
    picture:
      '/https://media.licdn.com/dms/image/v2/D4E03AQFjVs8_IjoSkQ/profile-displayphoto-shrink_800_800/B4EZXFCkVsHMAc-/0/1742767540080?e=1749081600&v=beta&t=UHyqr0nuzyRxo83ZAbtDH-rBFM_GBHIFLp09CSf3SAY',
    name: 'John Doe',
    isSubscribed: false,
    authMethod: 'email',
    createdAt: new Date().toISOString(),
  },
];

export class UserService {
  static async subscribeToPremium(userId: string, planDuration: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Trouver l'utilisateur
          const userIndex = mockUsers.findIndex(u => u.id === userId);
          if (userIndex === -1) {
            throw new Error("Utilisateur non trouvé");
          }

          // Mettre à jour l'utilisateur avec l'abonnement
          const updatedUser = {
            ...mockUsers[userIndex],
            isSubscribed: true,
            subscriptionPlan: planDuration,
            subscriptionDate: new Date().toISOString()
          };

          // Mettre à jour la "base de données"
          mockUsers[userIndex] = updatedUser;

          resolve(updatedUser);
        } catch (error) {
          reject(new Error("Échec de l'abonnement"));
        }
      }, 1000);
    });
  }

  static async getCurrentUser(token: string | null): Promise<User | null> {
    if (!token) return null;

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockUsers.find((u) => token.includes(u.id));
        user ? resolve(user) : reject(new Error('Invalid token'));
      }, 500);
    });
  }
} 