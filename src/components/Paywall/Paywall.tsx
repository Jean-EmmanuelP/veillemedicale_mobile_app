import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '$hooks/useUser.ts';
import { supabaseFetch } from '../../utils/supabaseFetch.ts';
import { useAuthToken } from '../../hooks/useAuthToken.ts';

interface PaywallProps {
  onClose: () => void;
  onSubscribeSuccess: () => void;
}

interface SubscriptionResponse {
  id: string;
  user_id: string;
  plan: string;
  duration: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: string;
  isSubscribed: boolean;
  subscriptionPlan: string;
  subscriptionEndDate: string;
}

const PLANS = [
  { duration: '1 mois', interval: '1 month', pricePerWeek: 4.99, savings: 'Prix standard' },
  { duration: '1 an', interval: '1 year', pricePerWeek: 1.99, savings: 'Économisez 80% - Meilleure offre!' },
];

export function Paywall({ onClose, onSubscribeSuccess }: PaywallProps) {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const { data: user } = useUser();
  const { token } = useAuthToken();
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Utilisateur non connecté");
      
      const now = new Date();
      const startDate = now.toISOString();
      const selectedPlanData = PLANS[selectedPlan];

      console.log('Creating subscription with duration:', selectedPlanData.interval);

      // Vérifier si l'utilisateur a déjà un abonnement actif
      const existingSubscriptions = await supabaseFetch<SubscriptionResponse[]>(`subscriptions?user_id=eq.${user.id}&status=eq.active`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (existingSubscriptions && existingSubscriptions.length > 0) {
        // Mettre à jour l'abonnement existant
        const existingSubscription = existingSubscriptions[0];
        
        // Convertir les intervalles en jours pour comparaison
        const intervalToDays: Record<string, number> = {
          'month': 30,
          'months': 30,
          'year': 365
        };
        
        const newInterval = selectedPlanData.interval.split(' ');
        const existingInterval = existingSubscription.duration.split(' ');
        
        const newDays = parseInt(newInterval[0]) * intervalToDays[newInterval[1]];
        const existingDays = parseInt(existingInterval[0]) * intervalToDays[existingInterval[1]];
        
        // Ne permet la mise à jour que si le nouvel abonnement est plus long
        if (newDays <= existingDays) {
          throw new Error("Vous ne pouvez pas passer à un abonnement plus court que votre abonnement actuel");
        }

        const response = await supabaseFetch<SubscriptionResponse>(`subscriptions?id=eq.${existingSubscription.id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            duration: selectedPlanData.interval,
            start_date: startDate,
            status: 'active'
          })
        });
      } else {
        // Créer un nouvel abonnement
        const response = await supabaseFetch<SubscriptionResponse>('subscriptions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            user_id: user.id,
            plan: 'premium',
            duration: selectedPlanData.interval,
            start_date: startDate,
            status: 'active'
          })
        });
      }

      // Récupérer les données utilisateur mises à jour
      const updatedUser = await supabaseFetch<User>('auth/v1/user', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return { user: updatedUser };
    },
    onSuccess: (data) => {
      // Mettre à jour les données utilisateur dans le cache
      queryClient.setQueryData(['user'], data.user);
      onSubscribeSuccess();
      handleClose();
    },
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubscribe = async () => {
    mutation.mutate();
  };

  const selectedPlanPrice = PLANS[selectedPlan].pricePerWeek * 4;

  return (
    <view
      class={`fixed top-0 left-0 right-0 bottom-0 bg-gray-900 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <view 
        class={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        bindtap={() => {}}
      >
        <view class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center" bindtap={handleClose}>
          <text class="text-2xl text-gray-500">×</text>
        </view>

        <text class="text-xl font-bold text-center mb-6 block">
          Tu n'as plus de likes gratuits pour aujourd'hui
        </text>

        <view class="space-y-3 mb-6">
          {PLANS.map((plan, index) => (
            <view 
              key={plan.duration}
              class={`p-4 rounded-xl border-2 transition-colors duration-200 cursor-pointer
                ${selectedPlan === index 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'}`}
              bindtap={() => setSelectedPlan(index)}
            >
              <view class="flex justify-between items-center">
                <text class="font-medium">{plan.duration}</text>
                <view class="flex items-baseline">
                  <text class="text-xl font-bold">{plan.pricePerWeek}€</text>
                  <text class="text-sm text-gray-500 ml-1">/sem</text>
                </view>
              </view>
              {plan.savings && (
                <text class="text-sm text-green-500 mt-1 block">{plan.savings}</text>
              )}
            </view>
          ))}
        </view>

        <view class="space-y-3 mb-6">
          <view class="flex items-center">
            <text class="text-2xl mr-2">∞</text>
            <text>Envoie un nombre illimité de likes</text>
          </view>
          <view class="flex items-center">
            <text class="text-2xl mr-2">👥</text>
            <text>Consulte tous les utilisateurs qui te likent</text>
          </view>
          <view class="flex items-center">
            <text class="text-2xl mr-2">⚡️</text>
            <text>Définis plus de préférences de rencontres</text>
          </view>
          <view class="flex items-center">
            <text class="text-2xl mr-2">⭐️</text>
            <text>Découvre chaque jour 2 fois plus de Standouts</text>
          </view>
        </view>

        <view 
          class="bg-blue-500 text-white p-4 rounded-xl text-center cursor-pointer"
          bindtap={handleSubscribe}
        >
          <text class="text-lg font-bold">
            {mutation.isPending 
              ? 'Traitement...' 
              : `Profite de ${PLANS[selectedPlan].duration} pour ${selectedPlanPrice.toFixed(2)}€`}
          </text>
        </view>

        <text class="text-xs text-gray-500 mt-4 block text-center">
          Pour envoyer un nombre illimité de likes, tu devras peut-être répondre au chat ou y mettre un terme lorsque ce sera ton tour. Ton paiement sera débité à ton abonnement sera renouvelé automatiquement pour la même durée de forfait, au même tarif, jusqu'à ce que tu l'annules dans les paramètres de l'App store.
        </text>
      </view>
    </view>
  );
}

