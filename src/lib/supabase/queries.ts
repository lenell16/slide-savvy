import { SupabaseClient } from "@supabase/supabase-js";
import { slides_v1 } from "googleapis";
import * as R from "ramda";

export async function getPresentationById(
  supabase: SupabaseClient<any, "public", any>,
  presentationId: string
) {
  return supabase
    .from("presentation")
    .select("*")
    .eq("id", presentationId)
    .single();
}
export async function getPresentationsByIds(
  supabase: SupabaseClient<any, "public", any>,
  presentationIds: string[]
) {
  return supabase.from("presentation").select("*").in("id", presentationIds);
}

export async function insertPresentation(
  supabase: SupabaseClient<any, "public", any>,
  presentation: slides_v1.Schema$Presentation
) {
  return supabase
    .from("presentation")
    .insert({
      id: presentation.presentationId,
      name: presentation.title,
    })
    .select();
}

export interface SlideContent {
  content_embeddings: any;
  notes_embeddings: any;
  presentation_id: string | null | undefined;
  object_id: string | null | undefined;
  content: string;
  notes: string;
}

export async function insertSlides(
  supabase: SupabaseClient<any, "public", any>,
  slideContents: SlideContent[]
) {
  return supabase.from("slide_content").insert(slideContents);
}
