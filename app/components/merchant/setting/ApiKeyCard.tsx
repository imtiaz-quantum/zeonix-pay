"use client";
import { use, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { RevealableField } from "./RevealableField";
import { ApiKeyItem, ApiResponse } from "@/app/lib/types/apiKey";



export default function ApiKeyCard({apiKeyPromise}: { apiKeyPromise: Promise<ApiResponse<ApiKeyItem>> }) {
  const router = useRouter();
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const payload = use(apiKeyPromise);
  const apiKey = payload.data;
  const handleGenerateKey = async () => {
    toast.promise(
      fetch("/api/merchant/apikey/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ merchant_id: apiKey.merchant }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to generate API key.");
        }
        const result = await response.json();
        router.refresh();
        return result;
      }),
      {
        loading: "Generating API Key...",
        success: <b>API Key successfully generated!</b>,
        error: <b>Failed to generate API Key.</b>,
      }
    );
  };

  const handleToggleActive = async (isActive: boolean) => {
    toast.promise(
      fetch("/api/merchant/apikey/generate", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: isActive,
        }),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to update API key status.");
        }
        const result = await response.json();
        router.refresh();
        return result;
      }),
      {
        loading: "Updating API Key status...",
        success: <b>API Key status updated successfully!</b>,
        error: <b>Failed to update API Key status.</b>,
      }
    );
  };

  const copyKey = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied!");
    } catch {
      toast.error("Copy failed.");
    }
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
      <div className="px-6 py-5 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-lg font-semibold">API Key</h2>
            <p className="text-sm text-muted-foreground">
              Generate a new key, reveal/copy, and toggle active.
            </p>
          </div>
          <button
            onClick={handleGenerateKey}
            className="inline-flex items-center gap-2 rounded-lg bg-customViolet px-3 py-2 text-sm font-semibold text-white hover:bg-customViolet/90"
          >
            Generate
          </button>
        </div>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div className="rounded-md border p-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="space-y-0.5">
              <p className="font-medium">Key #{apiKey.id}</p>
              <p className="text-xs text-muted-foreground">
                Updated {new Date(apiKey.created_at).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleActive(!apiKey.is_active)}
                className={[
                  "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium",
                  apiKey.is_active ? "text-emerald-700 hover:bg-emerald-50" : "text-slate-600 hover:bg-slate-50",
                ].join(" ")}
              >
                {apiKey.is_active ? (
                  <ToggleRight className="h-4 w-4 text-emerald-600" />
                ) : (
                  <ToggleLeft className="h-4 w-4 text-slate-400" />
                )}
                {apiKey.is_active ? "Active" : "Inactive"}
              </button>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <RevealableField
              label="API Key"
              value={apiKey.api_key}
              show={showApiKey}
              toggleShow={() => setShowApiKey(!showApiKey)}
              onCopy={() => copyKey(apiKey.api_key)}
            />
            <RevealableField
              label="Secret Key"
              value={apiKey.secret_key}
              show={showSecretKey}
              toggleShow={() => setShowSecretKey(!showSecretKey)}
              onCopy={() => copyKey(apiKey.secret_key)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}