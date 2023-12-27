import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { codeBlock } from "common-tags";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/transformers/generateEmbeddings";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { messages, presentation_id } = await req.json();

  const currentMessage = messages[messages.length - 1];

  const query_embedding = await generateEmbedding(currentMessage.content);

  const { data: documents, error: matchError } = await supabase
    .rpc("match_document_sections", {
      presentation_id,
      embedding: query_embedding,
      match_threshold: 0,
    })
    .select("content, notes")
    .limit(5);

  const injectedDocs =
    documents && documents.length > 0
      ? documents.map(({ content, notes }) => content + notes).join("\n")
      : "No documents found";

  const completionMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
    [
      {
        role: "user",
        content: codeBlock`
      You're an AI assistant who answers questions about documents.

      You're a chat bot, so keep your replies succinct.

      You're only allowed to use the documents below to answer the question.

      If the question isn't related to these documents, say:
      "Sorry, I couldn't find any information on that."

      If the information isn't available in the below documents, say:
      "Sorry, I couldn't find any information on that."

      Do not go off topic.

      Documents:
      ${injectedDocs}
    `,
      },
      ...messages,
    ];
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: completionMessages,
  });
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}
