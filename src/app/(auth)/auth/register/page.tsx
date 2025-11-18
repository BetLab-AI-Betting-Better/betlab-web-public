"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { signUpAction } from "@/presentation/actions/auth/auth.actions"
import {
  RegisterSchema,
  type RegisterFormData,
} from "@/application/validators/auth-schema"
import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { PasswordInput } from "@/presentation/components/ui/password-input"
import { Checkbox } from "@/presentation/components/ui/checkbox"
import { Label } from "@/presentation/components/ui/label"
import { useToast } from "@/presentation/hooks/use-toast"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [acceptTerms, setAcceptTerms] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    startTransition(async () => {
      const result = await signUpAction({
        email: data.email,
        password: data.password,
      })

      if (result.success) {
        toast({
          title: "Compte créé avec succès",
          description: "Bienvenue sur BetLab ! Complétez votre profil.",
        })
        router.push("/onboarding")
      } else {
        toast({
          variant: "destructive",
          title: "Erreur lors de l'inscription",
          description: result.error ?? "Une erreur est survenue. Veuillez réessayer.",
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            BetLab
          </h1>
          <p className="text-muted-foreground">
            Créez votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              autoComplete="email"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive" role="alert">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={acceptTerms}
              onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
              aria-label="Accepter les conditions"
            />
            <Label
              htmlFor="acceptTerms"
              className="text-sm font-normal cursor-pointer leading-tight"
            >
              J’accepte les{" "}
              <Link
                href="/terms"
                className="text-primary hover:underline"
                target="_blank"
              >
                conditions d’utilisation
              </Link>{" "}
              et la{" "}
              <Link
                href="/privacy"
                className="text-primary hover:underline"
                target="_blank"
              >
                politique de confidentialité
              </Link>
            </Label>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full h-12"
            disabled={isPending || !acceptTerms}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte...
              </>
            ) : (
              "Créer un compte"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">Déjà un compte ? </span>
          <Link
            href="/auth/login"
            className="text-primary font-medium hover:underline"
          >
            Se connecter
          </Link>
        </div>

        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
