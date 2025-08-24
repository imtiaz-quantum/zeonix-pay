"use client";

export const dynamic = "force-static";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-[70vh] grid place-items-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground">If the server is down, please try again later.</p>
            <div className="space-x-2">
              <Button onClick={() => reset()}>Try again</Button>
              <Link href="/server-down"><Button variant="outline">Server status</Button></Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
