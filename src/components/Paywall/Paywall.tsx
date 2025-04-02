import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '$api/user.ts';
import { useUser } from '$hooks/useUser.ts';

interface PaywallProps {
  onClose: () => void;
  onSubscribeSuccess: () => void;
}

const PLANS = [
  { duration: '1 mois', pricePerWeek: 4.99, savings: 'Économisez 20%' },
  { duration: '3 mois', pricePerWeek: 3.99, savings: 'Économisez 40%' },
  { duration: '6 mois', pricePerWeek: 2.99, savings: 'Économisez 60%' },
];

export function Paywall({ onClose, onSubscribeSuccess }: PaywallProps) {
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(0);
  const { data: user } = useUser();
  const mutation = useMutation({
    mutationFn: () => {
      if (!user?.id) throw new Error("Utilisateur non connecté");
      return UserService.subscribeToPremium(user.id, PLANS[selectedPlan].duration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      onSubscribeSuccess();
      handleClose();
    },
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Attendre la fin de l'animation
  };

  const handleSubscribe = async () => {
    const plan = PLANS[selectedPlan];
    mutation.mutate();
  };

  const selectedPlanPrice = PLANS[selectedPlan].pricePerWeek * 4;

  return (
    <view
      class={`fixed top-0 left-0 right-0 bottom-0 bg-gray-900 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      bindtap={handleClose}
    >
      <view 
        class={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
        catchtap={(e) => e.stopPropagation()}
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

