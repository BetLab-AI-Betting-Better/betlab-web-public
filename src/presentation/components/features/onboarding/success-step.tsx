/**
 * Onboarding Step 4: Success
 * Animation de succès avec confetti
 */

"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { cn } from '@/shared/utils';
import {
  completeOnboardingAction,
  type CompleteOnboardingInput,
} from "@/presentation/actions/onboarding/onboarding.actions";
import { toast } from 'sonner';

interface SuccessStepProps {
  formData: CompleteOnboardingInput;
  userId: string;
}

export function SuccessStep({ formData, userId }: SuccessStepProps) {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);

  // Auto-hide confetti après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const result = await completeOnboardingAction(formData);

      if (result.success) {
        toast.success('Profil créé avec succès !');
        router.push('/');
      } else {
        toast.error(result.error || 'Une erreur est survenue');
        setIsCompleting(false);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Une erreur est survenue');
      setIsCompleting(false);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8 max-w-md mx-auto w-full">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.2}
          colors={['#D4FD00', '#0A0F29', '#FFFFFF', '#FFA500', '#FF6B9D']}
        />
      )}

      {/* Success animation */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-lime/20 flex items-center justify-center animate-pulse">
          <div className="w-24 h-24 rounded-full bg-lime/40 flex items-center justify-center">
            <CheckCircle2 className="w-16 h-16 text-lime animate-bounce" />
          </div>
        </div>

        {/* Sparkles */}
        <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-lime animate-spin" />
        <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-lime animate-spin" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tout est prêt !</h1>
        <p className="text-muted-foreground">
          Votre profil a été créé avec succès
        </p>
      </div>

      {/* Summary */}
      <div className="w-full space-y-4 p-6 rounded-lg bg-card border border-border">
        <h2 className="font-semibold text-lg text-center">Récapitulatif</h2>

        <div className="space-y-3 text-sm">
          {/* Name */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Nom</span>
            <span className="font-medium">
              {formData.firstName} {formData.lastName}
            </span>
          </div>

          {/* Leagues */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Ligues suivies</span>
            <span className="font-medium text-lime">
              {formData.selectedLeagues.length} {formData.selectedLeagues.length > 1 ? 'ligues' : 'ligue'}
            </span>
          </div>

          {/* Prediction types */}
          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">Types de prédictions</span>
            <span className="font-medium text-lime">
              {formData.selectedPredictionTypes.length} {formData.selectedPredictionTypes.length > 1 ? 'types' : 'type'}
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <Button
        variant="lime"
        size="lg"
        className="w-full h-12 text-base font-semibold"
        onClick={handleComplete}
        disabled={isCompleting}
      >
        {isCompleting ? 'Chargement...' : "Découvrir l'app"}
      </Button>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center">
        Bienvenue dans BetLab ! Commencez à explorer les prédictions
      </p>
    </div>
  );
}
