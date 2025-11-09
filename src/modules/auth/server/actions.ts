"use server";

import "server-only";
import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import type { User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/infra/services/supabase/server-client";
import { AUTH_CACHE } from "../cache/profile";
import type {
  AuthUser,
  AuthActionResult,
  SignInInput,
  SignUpInput,
  ResetPasswordInput,
  UpdatePasswordInput,
} from "../domain/types";

/**
 * Transform Supabase User to AuthUser
 */
function transformUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    createdAt: user.created_at,
    metadata: user.user_metadata as Record<string, unknown>,
  };
}

/**
 * Sign in with email and password
 * Sets session cookies and redirects to dashboard
 */
export async function signInAction(
  input: SignInInput
): Promise<AuthActionResult<AuthUser>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: input.email,
      password: input.password,
    });

    if (error) {
      console.error("Sign in error:", error);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "No user returned" };
    }

    // Session is automatically set in cookies by Supabase
    const user = transformUser(data.user);

    console.log(`✅ User signed in: ${user.email}`);

    // Invalidate user cache
    updateTag(AUTH_CACHE.tags.profile(user.id));

    return { success: true, data: user };
  } catch (error) {
    console.error("Sign in error:", error);
    return { success: false, error: "An error occurred during sign in" };
  }
}

/**
 * Sign up with email and password
 * Creates new user and sets session cookies
 */
export async function signUpAction(
  input: SignUpInput
): Promise<AuthActionResult<AuthUser>> {
  try {
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: input.metadata,
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "No user returned" };
    }

    const user = transformUser(data.user);

    console.log(`✅ User signed up: ${user.email}`);

    return { success: true, data: user };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "An error occurred during sign up" };
  }
}

/**
 * Sign out current user
 * Clears session cookies and redirects to login
 */
export async function signOutAction(): Promise<AuthActionResult> {
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ User signed out");

    // Redirect to login
    redirect("/auth/login");
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "An error occurred during sign out" };
  }
}

/**
 * Send password reset email
 */
export async function resetPasswordAction(
  input: ResetPasswordInput
): Promise<AuthActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
      redirectTo: input.redirectUrl,
    });

    if (error) {
      console.error("Password reset error:", error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Password reset email sent to: ${input.email}`);
    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    return { success: false, error: "An error occurred during password reset" };
  }
}

/**
 * Update user password
 * Requires active session
 */
export async function updatePasswordAction(
  input: UpdatePasswordInput
): Promise<AuthActionResult> {
  try {
    const supabase = await createServerSupabaseClient();

    const { error } = await supabase.auth.updateUser({
      password: input.newPassword,
    });

    if (error) {
      console.error("Password update error:", error);
      return { success: false, error: error.message };
    }

    console.log("✅ Password updated successfully");
    return { success: true };
  } catch (error) {
    console.error("Password update error:", error);
    return { success: false, error: "An error occurred during password update" };
  }
}
