import { z } from "zod"

/**
 * Schema de validation pour la connexion
 * - Email: doit être valide
 * - Password: minimum 8 caractères
 */
export const LoginSchema = z.object({
  email: z
    .string({ message: "L'email est requis" })
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string({ message: "Le mot de passe est requis" })
    .min(1, "Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  rememberMe: z.boolean().optional(),
})

export type LoginFormData = z.infer<typeof LoginSchema>

/**
 * Schema de validation pour l'inscription
 * - Email: doit être valide
 * - Password: minimum 8 caractères, avec critères de sécurité
 * - ConfirmPassword: doit correspondre au password
 */
export const RegisterSchema = z
  .object({
    email: z
      .string({ message: "L'email est requis" })
      .min(1, "L'email est requis")
      .email("Format d'email invalide"),
    password: z
      .string({ message: "Le mot de passe est requis" })
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
      ),
    confirmPassword: z
      .string({ message: "La confirmation du mot de passe est requise" })
      .min(1, "La confirmation du mot de passe est requise"),
    acceptTerms: z
      .boolean()
      .refine((val) => val === true, {
        message: "Vous devez accepter les conditions d'utilisation",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type RegisterFormData = z.infer<typeof RegisterSchema>

/**
 * Schema de validation pour la réinitialisation de mot de passe
 */
export const ForgotPasswordSchema = z.object({
  email: z
    .string({ message: "L'email est requis" })
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
})

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>

/**
 * Schema de validation pour le changement de mot de passe
 */
export const ResetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Le mot de passe est requis" })
      .min(1, "Le mot de passe est requis")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
      ),
    confirmPassword: z
      .string({ message: "La confirmation du mot de passe est requise" })
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>
