import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '$api/user.ts';
import { useUser } from '$hooks/useUser.ts';

interface PaywallProps {
  onClose: () => void;
  onSubscribeSuccess: () => void;
}

interface Plan {
  duration: string;
  pricePerWeek: number;
  savings: string;
  label: string;
}

const PLANS: Plan[] = [
  {
    duration: '1 semaine',
    pricePerWeek: 14.99,
    savings: '',
    label: 'Nouveau'
  },
  {
    duration: '1 mois',
    pricePerWeek: 5.83,
    savings: '61 %',
    label: 'Économise 61 %'
  },
  {
    duration: '3 mois',
    pricePerWeek: 3.88,
    savings: '74 %',
    label: 'Économise 74 %'
  },
  {
    duration: '6 mois',
    pricePerWeek: 2.91,
    savings: '81 %',
    label: 'Économise 81 %'
  }
];

export function Paywall({ onClose, onSubscribeSuccess }: PaywallProps) {
  const queryClient = useQueryClient();
  const { data: user } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(2); // 3 mois par défaut

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    onError: () => {
    },
  });

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSubscribe = () => {
    mutation.mutate();
  };

  const selectedPlanPrice = PLANS[selectedPlan].pricePerWeek * 
    (selectedPlan === 0 ? 1 : selectedPlan === 1 ? 4 : selectedPlan === 2 ? 12 : 24);

  return (
    <view
      class={`absolute top-0 left-0 right-0 bottom-0 bg-black/50 ${isVisible ? 'visible' : 'hidden'}`}
      bindtap={handleClose}
    >
      <view 
        class={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-[90%] max-w-md ${isVisible ? 'visible' : 'hidden'}`}
        catchtap={(e) => e.stopPropagation()}
      >
        <view class="close-button" bindtap={handleClose}>×</view>

        <text class="paywall-title">
          Tu n'as plus de likes gratuits pour aujourd'hui
        </text>

        <view class="plan-selector">
          {PLANS.map((plan, index) => (
            <view 
              key={plan.duration}
              class={`plan-option ${selectedPlan === index ? 'active' : ''}`}
              bindtap={() => setSelectedPlan(index)}
            >
              <text class="plan-label">{plan.label}</text>
              <text class="plan-price">{plan.pricePerWeek}€</text>
              <text class="plan-period">/sem</text>
              {plan.savings && (
                <text class="savings-badge">{plan.savings}</text>
              )}
            </view>
          ))}
        </view>

        <view class="features-list">
          <view class="feature-item">
            <view class="feature-icon">∞</view>
            <text class="feature-text">Envoie un nombre illimité de likes</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">👥</view>
            <text class="feature-text">Consulte tous les utilisateurs qui te likent</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">⚡️</view>
            <text class="feature-text">Définis plus de préférences de rencontres</text>
          </view>
          <view class="feature-item">
            <view class="feature-icon">⭐️</view>
            <text class="feature-text">Découvre chaque jour 2 fois plus de Standouts</text>
          </view>
        </view>

        <view 
          class="subscribe-button"
          bindtap={handleSubscribe}
        >
          <text>
            {mutation.isPending 
              ? 'Traitement...' 
              : `Profite de ${PLANS[selectedPlan].duration} pour ${selectedPlanPrice.toFixed(2)}€`}
          </text>
        </view>

        <text class="legal-text">
          Pour envoyer un nombre illimité de likes, tu devras peut-être répondre au chat ou y mettre un terme lorsque ce sera ton tour. Ton paiement sera débité à ton abonnement sera renouvelé automatiquement pour la même durée de forfait, au même tarif, jusqu'à ce que tu l'annules dans les paramètres de l'App store.
        </text>
      </view>
    </view>
  );
}

