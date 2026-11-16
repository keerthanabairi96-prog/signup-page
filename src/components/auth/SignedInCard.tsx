import type { Session } from "@supabase/supabase-js";
import { CircleCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function SignedInCard({ session }: { session: Session }) {
  const user = session.user;
  const name = (user.user_metadata?.["full_name"] as string | undefined) ?? user.email;

  return (
    <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
      <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary text-primary">
        <CircleCheck className="size-6" />
      </span>
      <h1 className="mt-6 font-display text-4xl">You're in, {name?.split(" ")[0]}</h1>
      <p className="mt-2 text-muted-foreground">Signed in as {user.email}</p>
      <Button variant="outline" className="mt-8" onClick={() => supabase.auth.signOut()}>
        Sign out
      </Button>
    </div>
  );
}
