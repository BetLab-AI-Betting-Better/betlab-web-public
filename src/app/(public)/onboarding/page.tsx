import { redirect } from "next/navigation";
import { getCurrentUser } from "@/application/services/auth/session.service";
import { OnboardingClient } from "./page.client";

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/login');
  }

  return <OnboardingClient user={user} />;
}
