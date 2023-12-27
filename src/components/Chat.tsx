"use client";
import { Badge } from "@/components/ui/badge";
import { CardContent, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";

export function ChatMessage({
  message,
  type,
}: {
  message: string;
  type: "function" | "user" | "assistant" | "data" | "system" | "tool";
}) {
  return (
    <div
      className={cn("flex items-end space-x-2", {
        "justify-end": type === "user",
      })}
    >
      <Card
        className={cn({
          "bg-blue-100": type === "assistant",
          "bg-green-100": type === "user",
        })}
      >
        <CardContent className="p-2">
          <p>{message}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export function Chat({
  presentation,
}: {
  presentation: { id: string; name: string };
}) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: `/chat`,
    });
  return (
    <main className="grow w-full h-full p-6 bg-gray-50 0 flex flex-col space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{presentation.name}</h1>
        <Badge>Online</Badge>
      </header>
      <section className="flex-grow overflow-auto bg-white shadow p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            type={message.role}
            message={message.content}
          />
        ))}
      </section>
      <form
        className="space-y-2"
        onSubmit={async (e) => {
          e.preventDefault();

          handleSubmit(e, {
            options: {
              body: {
                presentation_id: presentation.id,
              },
            },
          });
        }}
      >
        <Label htmlFor="chat-input">Type your message</Label>
        <div className="flex gap-2">
          <Input
            className="w-full flex-grow"
            id="chat-input"
            autoFocus
            placeholder="Send a message"
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </main>
  );
}
