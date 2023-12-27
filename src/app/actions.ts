"use server";

import { createAuthClient, getPresentation } from "@/lib/google";
import { insertPresentation, insertSlides } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/transformers/generateEmbeddings";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as R from "ramda";

const getTextContent = R.pipe(
  R.pathOr([], ["shape", "text", "textElements"]),
  R.reduce(
    (text, textElement) =>
      text + R.pathOr("", ["textRun", "content"], textElement),
    ""
  )
);

const getContent = R.pipe(
  R.propOr([], "pageElements"),
  R.reduce((content, pageElement) => content + getTextContent(pageElement), ""),
  R.defaultTo("")
);

export async function generatePresentationEmbeddings(formData: FormData) {
  const presentationId = formData.get("presentationId") as string;

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
    return redirect("/");
  }

  const presentation = await getPresentation(authClient, presentationId);

  const { data } = await insertPresentation(supabase, presentation);

  const slideContentsPromises =
    presentation.slides
      ?.map((slide) => ({
        presentation_id: presentation.presentationId,
        object_id: slide.objectId,
        content: getContent(slide),
        notes: getContent(slide?.slideProperties?.notesPage),
      }))
      .map((slideContent) => {
        return Promise.all([
          generateEmbedding(slideContent.content),
          generateEmbedding(slideContent.notes),
        ]).then(([content_embeddings, notes_embeddings]) => ({
          ...slideContent,
          content_embeddings,
          notes_embeddings,
        }));
      }) ?? [];

  const slideContents = await Promise.all(slideContentsPromises);

  const { error } = await insertSlides(supabase, slideContents);

  revalidatePath("/");
}
