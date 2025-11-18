"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/presentation/components/ui/button";
import { ProgressBar } from "@/presentation/components/features/onboarding/progress-bar";
import { ProfileStep } from "@/presentation/components/features/onboarding/profile-step";
import { LeaguesStep } from "@/presentation/components/features/onboarding/leagues-step";
import { PreferencesStep } from "@/presentation/components/features/onboarding/preferences-step";
import { SuccessStep } from "@/presentation/components/features/onboarding/success-step";
import type { CurrentUser } from "@/core/entities/user.entity";

interface OnboardingClientProps {
  user: CurrentUser;
}

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

export function OnboardingClient({ user }: OnboardingClientProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);

  // Local state for form data
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    avatarUrl: null as string | null,
  });

  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);
  const [selectedPredictionTypes, setSelectedPredictionTypes] = useState<string[]>([]);
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'balanced' | 'aggressive' | null>(null);

  // Validation logic
  const canGoToNextStep = () => {
    switch (currentStep) {
      case 0: // Profile
        return profile.firstName.length >= 2 && profile.lastName.length >= 2;
      case 1: // Leagues
        return selectedLeagues.length > 0;
      case 2: // Preferences
        return selectedPredictionTypes.length > 0 && riskProfile !== null;
      case 3: // Success
        return false;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentStep < 3 && canGoToNextStep()) {
        setDirection(1);
        handleNext();
      }
    },
    onSwipedRight: () => {
      if (currentStep > 0 && currentStep < 3) {
        setDirection(-1);
        prevStep();
      }
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
  });

  const handleNext = () => {
    if (!canGoToNextStep()) {
      if (currentStep === 0) {
        toast.error('Veuillez renseigner votre prénom et nom (min 2 caractères)');
      } else if (currentStep === 1) {
        toast.error('Veuillez sélectionner au moins une ligue');
      } else if (currentStep === 2) {
        toast.error('Veuillez sélectionner au moins un type de prédiction et un profil de risque');
      }
      return;
    }

    setDirection(1);
    nextStep();
  };

  const handlePrev = () => {
    setDirection(-1);
    prevStep();
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ProfileStep
            profile={profile}
            onProfileChange={setProfile}
          />
        );
      case 1:
        return (
          <LeaguesStep
            selectedLeagues={selectedLeagues}
            onLeaguesChange={setSelectedLeagues}
          />
        );
      case 2:
        return (
          <PreferencesStep
            selectedPredictionTypes={selectedPredictionTypes}
            riskProfile={riskProfile}
            onPredictionTypesChange={setSelectedPredictionTypes}
            onRiskProfileChange={setRiskProfile}
          />
        );
      case 3:
        return (
          <SuccessStep
            formData={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              avatarUrl: profile.avatarUrl,
              selectedLeagues,
              selectedPredictionTypes,
              riskProfile: riskProfile!,
            }}
            userId={user.id}
          />
        );
      default:
        return (
          <ProfileStep
            profile={profile}
            onProfileChange={setProfile}
          />
        );
    }
  };

  const getButtonText = () => {
    if (currentStep === 2) return 'Terminer';
    if (currentStep === 3) return null;
    return 'Suivant';
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-background"
      {...swipeHandlers}
    >
      <ProgressBar currentStep={currentStep} totalSteps={4} />

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col"
          >
            {getStepComponent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {currentStep < 3 && (
        <div className="p-4 border-t bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] safe-area-bottom">
          <div className="flex gap-3 max-w-2xl mx-auto">
            {currentStep > 0 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handlePrev}
                className="px-4"
              >
                <ArrowLeft className="w-4 w-4" />
                Précédent
              </Button>
            )}

            <Button
              variant="lime"
              size="lg"
              onClick={handleNext}
              className="flex-1"
              disabled={!canGoToNextStep()}
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
