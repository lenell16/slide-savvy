import AuthButton from "@/components/AuthButton";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { drive_v3, google } from "googleapis";
import PresentationCard from "@/components/PresentationCard";

export default async function Index() {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let files: drive_v3.Schema$File[] = [];

  if (session?.provider_token) {
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: session?.provider_token });

    const drive = google.drive({ version: "v3", auth });
    const response = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.presentation' and 'me' in owners",
      fields:
        "files(id, name, thumbnailLink, lastModifyingUser, viewedByMeTime, shared)",
    });

    files = response.data.files ?? [];
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <Link href="/" className="font-bold">
            SlideSavvy
          </Link>
          <AuthButton />
        </div>
      </nav>
      <main className="flex-1 w-full max-w-4xl flex flex-col gap-10 p-3">
        <h1 className="text-4xl font-bold">Your Presentations</h1>
        <div className="grid grid-cols-3 gap-4">
          {files.map((file) => (
            <PresentationCard key={file.id} {...file} />
          ))}
        </div>
      </main>
    </div>
  );
}
