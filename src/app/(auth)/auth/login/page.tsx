"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Loader2 } from "lucide-react"

import { signInAction } from "@/presentation/actions/auth/auth.actions"
import { LoginSchema, type LoginFormData } from "@/application/validators/auth-schema"
import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { PasswordInput } from "@/presentation/components/ui/password-input"
import { Checkbox } from "@/presentation/components/ui/checkbox"
import { Label } from "@/presentation/components/ui/label"
import { useToast } from "@/presentation/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    startTransition(async () => {
      const result = await signInAction({
        email: data.email,
        password: data.password,
      })

      if (result.success) {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur BetLab !",
        })
        router.push("/")
      } else {
        toast({
          variant: "destructive",
          title: "Erreur de connexion",
          description: result.error ?? "Email ou mot de passe incorrect",
        })
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background dark:bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            BetLab
          </h1>
          <p className="text-muted-foreground">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
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

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setRememberMe(checked as boolean)
                }
                aria-label="Se souvenir de moi"
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal cursor-pointer"
              >
                Se souvenir de moi
              </Label>
            </div>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full h-12"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion en cours...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Pas de compte ? </span>
          <Link
            href="/auth/register"
            className="text-primary font-medium hover:underline"
          >
            Créer un compte
          </Link>
        </div>

        {/* Safe Area for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  )
}
