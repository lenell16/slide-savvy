import PresentationCard from "@/components/PresentationCard";
import { createAuthClient, getPresentations } from "@/lib/google";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { getPresentationsByIds } from "@/lib/supabase/queries";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const authClient = createAuthClient({
    access_token: session?.provider_token,
    refresh_token: session?.provider_refresh_token,
  });

  if (authClient == null) {
    return (
      <div className="grow flex justify-center items-center">
        <h2 className="text-2xl font-bold">
          You&apos;re not signed in. Sign in to see your presentations. <br />
        </h2>
      </div>
    );
  }

  const files = await getPresentations(authClient);

  const { data } = await getPresentationsByIds(
    supabase,
    files.filter((file) => file.id).map((file) => file.id!)
  );

  const filesById = data?.reduce(
    (acc, file) => ({ ...acc, [file.id]: file }),
    {}
  );

  return (
    <main className="flex-1 w-full max-w-4xl flex flex-col gap-10 p-3">
      <h1 className="text-4xl font-bold">Your Presentations</h1>
      <div className="grid grid-cols-3 gap-4">
        {files.map((file) => (
          <PresentationCard
            key={file.id}
            file={file}
            embeddingsGenerated={filesById[file.id!]}
          />
        ))}
      </div>
    </main>
  );
}
