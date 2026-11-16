import type { ReactNode } from "react";
import art from "@/assets/register-art.jpg";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-panel text-panel-foreground lg:block">
        <img
          src={art}
          alt="Eucalyptus sprig beside a sheet of handmade paper"
          width={1024}
          height={1536}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="font-display text-5xl leading-[1.05] italic">
            A quiet place
            <br />
            to begin.
          </p>
          <p className="mt-4 max-w-sm text-sm text-panel-foreground/75">
            One account, everything in one place. It only takes a minute.
          </p>
        </div>
      </aside>

      <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-md animate-rise">{children}</div>
      </section>
    </main>
  );
}
