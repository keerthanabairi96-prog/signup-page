import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField } from "@/components/auth/FormField";
import { SocialButtons, OrDivider } from "@/components/auth/SocialButtons";
import { SignedInCard } from "@/components/auth/SignedInCard";
import { loginSchema } from "@/lib/auth-schemas";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in" },
      { name: "description", content: "Sign in to your account." },
      { property: "og:title", content: "Sign in" },
      { property: "og:description", content: "Sign in to your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const session = useSession();
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "email" | "password";
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) toast.error("Couldn't sign in", { description: error.message });
  }

  return (
    <AuthShell>
      {session ? (
        <SignedInCard session={session} />
      ) : (
        <>
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Welcome back</p>
          <h1 className="mt-3 font-display text-5xl leading-none">Sign in</h1>

          <div className="mt-8">
            <SocialButtons />
          </div>

          <OrDivider />

          <form noValidate onSubmit={onSubmit} className="grid gap-4">
            <FormField id="email" label="Email" type="email" autoComplete="email" error={errors.email} />
            <FormField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              error={errors.password}
            />
            <Button type="submit" size="lg" className="mt-2" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/" className="font-medium text-primary underline-offset-4 hover:underline">
              Create an account
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
