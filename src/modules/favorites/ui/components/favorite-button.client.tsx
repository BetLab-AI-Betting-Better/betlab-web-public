"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleFavoriteAction } from "../../server/actions";
import { Button } from "@/shared/ui/button";
import { useToast } from "@/shared/hooks/use-toast";

interface FavoriteButtonProps {
  userId: string;
  fixtureId: number;
  initialFavorited: boolean;
  variant?: "icon" | "text";
  className?: string;
}

export function FavoriteButton({
  userId,
  fixtureId,
  initialFavorited,
  variant = "icon",
  className,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleToggle = () => {
    startTransition(async () => {
      // Optimistic update
      setIsFavorited(!isFavorited);

      const result = await toggleFavoriteAction(userId, fixtureId, isFavorited);

      if (!result.success) {
        // Revert on error
        setIsFavorited(isFavorited);
        toast({
          title: "Error",
          description: result.error ?? "Failed to update favorite",
          variant: "destructive",
        });
      }
    });
  };

  if (variant === "text") {
    return (
      <Button
        variant={isFavorited ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        disabled={isPending}
        className={className}
      >
        <Heart
          className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
        />
        {isFavorited ? "Favorited" : "Add to Favorites"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isPending}
      className={className}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isFavorited ? "fill-red-500 text-red-500" : "text-gray-400"
        }`}
      />
    </Button>
  );
}
