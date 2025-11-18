"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { CheckCircle, ArrowLeft, Mail, Loader2 } from "lucide-react"
import { resetPasswordAction } from "@/presentation/actions/auth/auth.actions"
import { Button } from "@/presentation/components/ui/button"
import { Input } from "@/presentation/components/ui/input"
import { useToast } from "@/presentation/hooks/use-toast"

const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPending, startTransition] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordFormData) {
    startTransition(true)

    const result = await resetPasswordAction({
      email: data.email,
      redirectUrl: `${window.location.origin}/auth/reset-password`,
    })

    startTransition(false)

    if (result.success) {
      setIsSubmitted(true)
    } else {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: result.error || "Une erreur est survenue",
      })
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Email envoyé !
            </h1>
            <p className="text-base text-muted-foreground">
              Vérifiez votre boîte mail. Un lien de réinitialisation vous a été envoyé.
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 text-left space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Important :</strong>
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Vérifiez également vos spams</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Le lien est valide pendant 24 heures</span>
              </li>
            </ul>
          </div>

          <Button
            variant="primary"
            className="h-12 w-full text-base"
            asChild
          >
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour à la connexion
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(1.5rem+env(safe-area-inset-top))]">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Mot de passe oublié ?
          </h1>
          <p className="text-base text-muted-foreground">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.com"
              autoComplete="email"
              className="h-12 text-base"
              aria-invalid={errors.email ? "true" : "false"}
              disabled={isPending}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
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
                Envoi en cours...
              </>
            ) : (
              "Envoyer le lien de réinitialisation"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
