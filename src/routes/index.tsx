import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/AuthShell";
import { FormField } from "@/components/auth/FormField";
import { SocialButtons, OrDivider } from "@/components/auth/SocialButtons";
import { SignedInCard } from "@/components/auth/SignedInCard";
import { registerSchema, type RegisterValues } from "@/lib/auth-schemas";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Create your account" },
      { name: "description", content: "Sign up with your email, Google or Lovable account." },
      { property: "og:title", content: "Create your account" },
      { property: "og:description", content: "Sign up with your email, Google or Lovable account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

type Errors = Partial<Record<keyof RegisterValues, string>>;

function RegisterPage() {
  const session = useSession();
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof RegisterValues;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    const { fullName, email, password } = parsed.data;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't create your account", { description: error.message });
      return;
    }
    if (!data.session) setSentTo(email);
  }

  if (session) {
    return (
      <AuthShell>
        <SignedInCard session={session} />
      </AuthShell>
    );
  }

  if (sentTo) {
    return (
      <AuthShell>
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
            <MailCheck className="size-6" />
          </span>
          <h1 className="mt-6 font-display text-4xl">Check your inbox</h1>
          <p className="mt-3 text-muted-foreground">
            We sent a confirmation link to <span className="font-medium text-foreground">{sentTo}</span>.
            Click it to finish creating your account.
          </p>
          <Button variant="link" className="mt-6" onClick={() => setSentTo(null)}>
            Use a different email
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">Get started</p>
      <h1 className="mt-3 font-display text-5xl leading-none">Create your account</h1>
      <p className="mt-3 text-muted-foreground">Join in a few seconds — no credit card needed.</p>

      <div className="mt-8">
        <SocialButtons />
      </div>

      <OrDivider />

      <form noValidate onSubmit={onSubmit} className="grid gap-4">
        <FormField id="fullName" label="Full name" autoComplete="name" placeholder="Jane Doe" error={errors.fullName} />
        <FormField id="email" label="Email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          error={errors.password}
        />
        <FormField
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <Button type="submit" size="lg" className="mt-2" disabled={submitting}>
          {submitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
