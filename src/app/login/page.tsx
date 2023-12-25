"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { JSX, SVGProps } from "react";

export default function LandingPage() {
  const supabase = createClient();

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent('/')}`,
      },
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white">
      <section className="w-full py-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col justify-center space-y-4 items-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-center sm:text-5xl xl:text-6xl/none">
                SlideSavvy: Smarter Slides
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl  text-center">
                Transform your Google Slides into an interactive Q&A platform.
                Make your presentations more engaging and insightful.
              </p>
            </div>

            <Button onClick={handleSignIn}>
              <ChromeIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ChromeIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <line x1="21.17" x2="12" y1="8" y2="8" />
      <line x1="3.95" x2="8.54" y1="6.06" y2="14" />
      <line x1="10.88" x2="15.46" y1="21.94" y2="14" />
    </svg>
  );
}