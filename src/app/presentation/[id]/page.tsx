import { createAuthClient, getPresentation } from "@/lib/google";
import {
  getPresentationById,
  insertPresentation,
  insertSlides,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import delay from "delay";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Chat } from "@/components/Chat";

export default async function Presentation({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  let { data, error } = await getPresentationById(supabase, params.id);

  if (error) {
    redirect("/");
  }
  return <Chat presentation={data} />;
}
