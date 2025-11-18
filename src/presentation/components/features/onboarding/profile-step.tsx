/**
 * Onboarding Step 1: Profile
 * Collecte prénom, nom, et avatar
 */

"use client";

import React from 'react';
import { Camera, User } from 'lucide-react';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { cn } from '@/shared/utils';

interface ProfileStepProps {
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  onProfileChange: (profile: { firstName: string; lastName: string; avatarUrl: string | null }) => void;
}

export function ProfileStep({ profile, onProfileChange }: ProfileStepProps) {
  const { firstName, lastName, avatarUrl } = profile;

  const isFirstNameValid = firstName.trim().length >= 2;
  const isLastNameValid = lastName.trim().length >= 2;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 space-y-8 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Créez votre profil</h1>
        <p className="text-muted-foreground">Comment devons-nous vous appeler ?</p>
      </div>

      {/* Avatar */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-border overflow-hidden">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-12 h-12 text-muted-foreground" />
          )}
        </div>

        {/* Camera icon overlay */}
        <button
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-lime text-navy flex items-center justify-center shadow-md hover:bg-lime/90 transition-colors active:scale-95"
          onClick={() => {
            // TODO: Implement avatar upload
            console.log('Upload avatar');
          }}
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Form */}
      <div className="w-full space-y-6">
        {/* Prénom */}
        <div className="space-y-2">
          <Label htmlFor="firstName">
            Prénom <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="John"
            value={firstName}
            onChange={(e) => onProfileChange({ ...profile, firstName: e.target.value })}
            className={cn(
              "transition-all",
              firstName && !isFirstNameValid && "border-destructive"
            )}
            aria-invalid={firstName ? !isFirstNameValid : undefined}
          />
          {firstName && !isFirstNameValid && (
            <p className="text-xs text-destructive">Le prénom doit contenir au moins 2 caractères</p>
          )}
        </div>

        {/* Nom */}
        <div className="space-y-2">
          <Label htmlFor="lastName">
            Nom <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => onProfileChange({ ...profile, lastName: e.target.value })}
            className={cn(
              "transition-all",
              lastName && !isLastNameValid && "border-destructive"
            )}
            aria-invalid={lastName ? !isLastNameValid : undefined}
          />
          {lastName && !isLastNameValid && (
            <p className="text-xs text-destructive">Le nom doit contenir au moins 2 caractères</p>
          )}
        </div>
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center">
        Ces informations seront utilisées pour personnaliser votre expérience
      </p>
    </div>
  );
}
