"use client"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// derive the exact types from your Button component
type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];

export default function ConfirmAction({
  triggerLabel,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  triggerVariant = "ghost",
  triggerSize = "sm",
  destructive = false,
}: {
  triggerLabel: string;
  title: string;
  description?: string;
  onConfirm: () => Promise<void> | void;
  confirmLabel?: string;
  triggerVariant?: ButtonVariant; // <-- no any
  triggerSize?: ButtonSize;
  destructive?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={triggerVariant} size={triggerSize}>{triggerLabel}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                setLoading(true);
                await onConfirm();
              } finally {
                setLoading(false);
                setOpen(false);
              }
            }}
            className={`${destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-customViolet hover:bg-customViolet/90"} text-white cursor-pointer`}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
