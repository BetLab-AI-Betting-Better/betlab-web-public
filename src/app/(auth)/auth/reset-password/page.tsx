"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { CheckCircle, Loader2 } from "lucide-react"
import { updatePasswordAction } from "@/presentation/actions/auth/auth.actions"
import { Button } from "@/presentation/components/ui/button"
import { PasswordInput } from "@/presentation/components/ui/password-input"
import { PasswordStrength } from "@/presentation/components/ui/password-strength"
import { useToast } from "@/presentation/hooks/use-toast"

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const password = watch("password")

  async function onSubmit(data: ResetPasswordFormData) {
    startTransition(true)

    const result = await updatePasswordAction({
      newPassword: data.password,
    })

    startTransition(false)

    if (result.success) {
      setIsSuccess(true)
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été modifié avec succès",
      })
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
      })
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Mot de passe mis à jour !
            </h1>
            <p className="text-base text-muted-foreground">
              Redirection vers la page de connexion...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Nouveau mot de passe
          </h1>
          <p className="text-base text-muted-foreground">
            Choisissez un nouveau mot de passe sécurisé
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Nouveau mot de passe
            </label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="new-password"
              className="h-12 text-base"
              aria-invalid={errors.password ? "true" : "false"}
              disabled={isPending}
              {...register("password")}
            />
            {password && <PasswordStrength password={password} />}
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Confirmer le mot de passe
            </label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              className="h-12 text-base"
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              disabled={isPending}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="h-12 w-full text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Réinitialiser le mot de passe"
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
