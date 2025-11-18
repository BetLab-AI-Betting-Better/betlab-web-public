/**
 * Onboarding Progress Bar
 * Affiche 4 dots avec ligne de progression animée
 */

"use client";

import React from 'react';
import { cn } from '@/shared/utils';

interface ProgressBarProps {
  currentStep: number; // 0-3
  totalSteps: number; // 4
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <div className="px-6 py-4 bg-background border-b sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {/* Dot */}
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                index <= currentStep
                  ? "bg-lime text-navy"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>

            {/* Line between dots */}
            {index < totalSteps - 1 && (
              <div className="flex-1 h-1 mx-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-lime transition-all duration-500 ease-in-out",
                    index < currentStep ? "w-full" : "w-0"
                  )}
                  style={{
                    width: index < currentStep ? '100%' : '0%',
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
