import {
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { JSX, SVGProps } from "react";
import { drive_v3 } from "googleapis";
import { format } from "date-fns";
import { SubmitButton } from "@/components/SubmitButton";
import { generatePresentationEmbeddings } from "@/app/actions";
import { Button } from "./ui/button";
import Link from "next/link";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function PresentationCard({
  file,
  embeddingsGenerated,
}: {
  file: drive_v3.Schema$File;
  embeddingsGenerated: boolean;
}) {
  let owner = file.lastModifyingUser?.displayName ?? "Unknown";

  if (file.lastModifyingUser?.me) {
    owner = "me";
  }

  return (
    <Card className="w-full flex flex-col">
      <img
        alt="Intl.MessageFormat Thumbnail"
        className="w-full h-full object-cover"
        height={200}
        src={file.thumbnailLink!}
        width={350}
      />
      <CardHeader>
        <CardTitle className="truncate">{file.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {embeddingsGenerated ? (
          <Button variant="secondary" className="w-full" asChild>
            <Link href={`/presentation/${file.id}`}>Go to Chat</Link>
          </Button>
        ) : (
          <form action={generatePresentationEmbeddings}>
            <input type="hidden" name="presentationId" value={file.id!} />
            <SubmitButton
              className="w-full"
              renderPending={
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Generating Embeddings...
                </>
              }
            >
              Generate Embeddings
            </SubmitButton>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center">
          {file.shared && <UserIcon className="w-4 h-4 mr-2" />}
          <p className="text-sm">{owner}</p>
        </div>
        <p className="text-sm">
          {format(new Date(file.viewedByMeTime!), "MM/dd/yyyy")}
        </p>
      </CardFooter>
    </Card>
  );
}

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
