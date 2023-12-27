"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({
  children,
  renderPending = "Submitting...",
  ...props
}: {
  children: React.ReactNode;
  renderPending?: React.ReactNode;
} & React.ComponentProps<typeof Button>) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} aria-disabled={pending} {...props}>
      {pending ? renderPending : children}
    </Button>
  );
}
