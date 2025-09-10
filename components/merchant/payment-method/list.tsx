// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Landmark, Smartphone, Coins } from "lucide-react";
// import clsx from "clsx";
// import toast from "react-hot-toast";
// import ConfirmAction from "../../ConfirmAction";
// import { useRouter } from "next/navigation";

// type MethodType = "bkash" | "nagad" | "rocket" | "upay" | "bank" | "crypto";

// export type PaymentMethod = {
//   id: number;
//   method_type: MethodType;
//   params: {
//     account_name: string;
//     account_number: string;
//   };
//   status: string; // "active" | "inactive" | "pending" | ...
//   is_primary: boolean;
//   created_at: string;
//   updated_at: string;
//   merchant: number;
// };

// const getMessage = (x: unknown): string | undefined => {
//   if (typeof x === "object" && x !== null) {
//     const m = (x as Record<string, unknown>).message;
//     if (typeof m === "string") return m;
//   }
//   return undefined;
// };

// const methodIconMap: Record<"bank" | "mobile" | "crypto", React.ComponentType<{ className?: string }>> = {
//   bank: Landmark,
//   mobile: Smartphone,
//   crypto: Coins,
// };

// function getProviderAsset(method: MethodType): {
//   src?: string;
//   alt?: string;
//   fallback: "bank" | "mobile" | "crypto";
// } {
//   const m = method.toLowerCase();
//   if (m === "bkash") return { src: "/bkash.png", alt: "bKash", fallback: "mobile" };
//   if (m === "nagad") return { src: "/nagad.jpg", alt: "Nagad", fallback: "mobile" };
//   if (m === "rocket") return { src: "/rocket.png", alt: "Rocket", fallback: "mobile" };
//   if (m === "upay") return { src: "/upay.png", alt: "Upay", fallback: "mobile" };
//   if (m === "crypto") return { src: "/binance.png", alt: "Crypto", fallback: "crypto" };
//   if (m === "bank") return { fallback: "bank" };
//   return { fallback: "mobile" };
// }

// function ProviderLogo({ method, className }: { method: MethodType; className?: string }) {
//   const { src, alt, fallback } = getProviderAsset(method);
//   if (src) {
//     return <Image src={src} alt={alt || "provider"} width={20} height={20} className={clsx("h-5 w-5", className)} />;
//   }
//   const Fallback = methodIconMap[fallback];
//   return <Fallback className={clsx("h-5 w-5 text-muted-foreground", className)} />;
// }

// function maskNumber(n: string) {
//   if (!n) return "";
//   const last4 = n.slice(-4);
//   return `•••• ${last4}`;
// }

// export default function PaymentMethodsList({ data }: { data: PaymentMethod[] }) {
//   const [methods, setMethods] = useState<PaymentMethod[]>(data ?? []);
//   const [busyId, setBusyId] = useState<number | null>(null);
//   const router = useRouter();

//   // Keep in sync with parent updates (page change / refresh)
//   useEffect(() => {
//     setMethods(data ?? []);
//   }, [data]);

//   const setPrimary = async (id: number) => {
//     if (busyId) return;
//     setBusyId(id);

//     // optimistic
//     const snapshot = methods;
//     setMethods((prev) => prev.map((m) => ({ ...m, is_primary: m.id === id })));

//     const res = await fetch(`/api/merchant/payment-methods/${id}/set-primary`, { method: "PATCH" });
//     const json = await res.json().catch(() => null);
//     if (!res.ok) {
//       setMethods(snapshot); // revert
//       toast.error(json?.message ?? "Could not set primary.");
//       setBusyId(null);
//       return;
//     }

//     toast.success(json?.message ?? "Primary set successfully!");
//     setBusyId(null);
//     router.refresh();
//   };

//   const toggleActive = async (id: number) => {
//     if (busyId) return;
//     setBusyId(id);

//     const snapshot = methods;
//     setMethods((prev) =>
//       prev.map((pm) =>
//         pm.id === id ? { ...pm, status: pm.status === "active" ? "deactive" : "active" } : pm
//       )
//     );

//     const res = await fetch(`/api/merchant/payment-methods/${id}/set-active-deactive`, { method: "PATCH" });
//     const json = await res.json().catch(() => null);
//     if (!res.ok) {
//       setMethods(snapshot); // revert
//       toast.error(json?.message ?? "Could not update status");
//       setBusyId(null);
//       return;
//     }

//     toast.success(json?.message ?? "Status updated!");
//     setBusyId(null);
//     router.refresh();
//   };

//   const removeMethod = async (id: number) => {
//     if (busyId) return;
//     setBusyId(id);

//     const snapshot = methods;
//     setMethods((prev) => prev.filter((m) => m.id !== id));

//     const res = await fetch(`/api/merchant/payment-methods/${id}`, { method: "DELETE" });

//     let dataResp: unknown = null;
//     try {
//       dataResp = await res.json();
//     } catch {
//       /* 204 or empty body */
//     }
//     const msg = getMessage(dataResp);

//     if (!res.ok) {
//       setMethods(snapshot); // revert
//       toast.error(msg ?? "Could not delete method.");
//       setBusyId(null);
//       return;
//     }

//     toast.success(msg ?? "Payment method removed.");
//     setBusyId(null);
//     router.refresh();
//   };

//   return (
//     <div className="space-y-4 p-4 sm:p-6">
//       {methods.length === 0 && (
//         <div className="border rounded-xl p-4 text-sm text-muted-foreground bg-card">
//           No payment methods yet.
//         </div>
//       )}

//       <div className="grid grid-cols-1 gap-3">
//         {methods.map((m) => (
//           <div
//             key={m.id}
//             className="border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white hover:shadow-sm transition"
//           >
//             <div className="flex items-start sm:items-center gap-3">
//               <div className="rounded-lg bg-muted p-2 mt-0.5">
//                 <ProviderLogo method={m.method_type} />
//               </div>
//               <div>
//                 <p className="font-medium flex flex-wrap items-center gap-2">
//                   {m.method_type.charAt(0).toUpperCase() + m.method_type.slice(1)}
//                   {m.is_primary && <Badge variant="outline" className="rounded-full">Primary</Badge>}
//                   <Badge
//                     className={clsx(
//                       "capitalize rounded-full",
//                       m.status === "active" ? "bg-green-600" : "bg-gray-400"
//                     )}
//                   >
//                     {m.status}
//                   </Badge>
//                 </p>
//                 <p className="text-sm text-muted-foreground">
//                   {m.params.account_name} • {maskNumber(m.params.account_number)}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-wrap items-center gap-2">
//               {/* Set Primary */}
//               {!m.is_primary ? (
//                 busyId === m.id ? (
//                   <Button variant="outline" size="sm" disabled>
//                     Set Primary
//                   </Button>
//                 ) : (
//                   <ConfirmAction
//                     triggerLabel="Set Primary"
//                     title="Set this method as Primary?"
//                     description="This will become your default withdrawal method."
//                     confirmLabel="Yes, set primary"
//                     onConfirm={() => setPrimary(m.id)}
//                   />
//                 )
//               ) : null}

//               {/* Activate / Deactivate */}
//               {busyId === m.id ? (
//                 <Button variant="outline" size="sm" disabled>
//                   {m.status === "active" ? "Deactivate" : "Activate"}
//                 </Button>
//               ) : (
//                 <ConfirmAction
//                   triggerLabel={m.status === "active" ? "Deactivate" : "Activate"}
//                   title={`${m.status === "active" ? "Deactivate" : "Activate"} this method?`}
//                   description={m.status === "active" ? "You can activate it again later." : "This method will be marked active."}
//                   confirmLabel={m.status === "active" ? "Yes, deactivate" : "Yes, activate"}
//                   onConfirm={() => toggleActive(m.id)}
//                 />
//               )}

//               {/* Remove */}
//               {busyId === m.id ? (
//                 <Button variant="destructive" size="sm" disabled>
//                   Remove
//                 </Button>
//               ) : (
//                 <ConfirmAction
//                   triggerLabel="Remove"
//                   title="Remove payment method?"
//                   description="This action cannot be undone."
//                   confirmLabel="Yes, remove"
//                   destructive
//                   onConfirm={() => removeMethod(m.id)}
//                 />
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Landmark, Smartphone, Coins } from "lucide-react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { MethodType, PaymentMethod } from "@/lib/types/payment-method";
import ConfirmAction from "@/components/ConfirmAction";


const getMessage = (x: unknown): string | undefined => {
  if (typeof x === "object" && x !== null) {
    const m = (x as Record<string, unknown>).message;
    if (typeof m === "string") return m;
  }
  return undefined;
};

const methodIconMap: Record<"bank" | "mobile" | "crypto", React.ComponentType<{ className?: string }>> = {
  bank: Landmark,
  mobile: Smartphone,
  crypto: Coins,
};

function getProviderAsset(method: MethodType): {
  src?: string;
  alt?: string;
  fallback: "bank" | "mobile" | "crypto";
} {
  const m = method.toLowerCase();
  if (m === "bkash") return { src: "/bkash.png", alt: "bKash", fallback: "mobile" };
  if (m === "nagad") return { src: "/nagad.jpg", alt: "Nagad", fallback: "mobile" };
  if (m === "rocket") return { src: "/rocket.png", alt: "Rocket", fallback: "mobile" };
  if (m === "upay") return { src: "/upay.png", alt: "Upay", fallback: "mobile" };
  if (m === "crypto") return { src: "/binance.png", alt: "Crypto", fallback: "crypto" };
  if (m === "bank") return { fallback: "bank" };
  return { fallback: "mobile" };
}

function ProviderLogo({ method, className }: { method: MethodType; className?: string }) {
  const { src, alt, fallback } = getProviderAsset(method);
  if (src) {
    return <Image src={src} alt={alt || "provider"} width={20} height={20} className={clsx("h-5 w-5", className)} />;
  }
  const Fallback = methodIconMap[fallback];
  return <Fallback className={clsx("h-5 w-5 text-muted-foreground", className)} />;
}

function maskNumber(n: string) {
  if (!n) return "";
  const last4 = n.slice(-4);
  return `•••• ${last4}`;
}

export default function PaymentMethodsList({ data }: { data: PaymentMethod[] }) {
  const [methods, setMethods] = useState<PaymentMethod[]>(data ?? []);
  const [busyId, setBusyId] = useState<number | null>(null);
  const router = useRouter();

  // Keep in sync with parent updates (page change / refresh)
  useEffect(() => {
    setMethods(data ?? []);
  }, [data]);

  const setPrimary = async (id: number) => {
    if (busyId) return;
    setBusyId(id);

    // optimistic
    const snapshot = methods;
    setMethods((prev) => prev.map((m) => ({ ...m, is_primary: m.id === id })));

    const res = await fetch(`/api/merchant/payment-methods/${id}/set-primary`, { method: "PATCH" });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setMethods(snapshot); // revert
      toast.error(json?.message ?? "Could not set primary.");
      setBusyId(null);
      return;
    }

    toast.success(json?.message ?? "Primary set successfully!");
    setBusyId(null);
    router.refresh();
  };

  const toggleActive = async (id: number) => {
    if (busyId) return;
    setBusyId(id);

    const snapshot = methods;
    setMethods((prev) =>
      prev.map((pm) =>
        pm.id === id ? { ...pm, status: pm.status === "active" ? "deactive" : "active" } : pm
      )
    );

    const res = await fetch(`/api/merchant/payment-methods/${id}/set-active-deactive`, { method: "PATCH" });
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      setMethods(snapshot); // revert
      toast.error(json?.message ?? "Could not update status");
      setBusyId(null);
      return;
    }

    toast.success(json?.message ?? "Status updated!");
    setBusyId(null);
    router.refresh();
  };

  const removeMethod = async (id: number) => {
    if (busyId) return;
    setBusyId(id);

    const snapshot = methods;
    setMethods((prev) => prev.filter((m) => m.id !== id));

    const res = await fetch(`/api/merchant/payment-methods/${id}`, { method: "DELETE" });

    let dataResp: unknown = null;
    try {
      dataResp = await res.json();
    } catch {
      /* 204 or empty body */
    }
    const msg = getMessage(dataResp);

    if (!res.ok) {
      setMethods(snapshot); // revert
      toast.error(msg ?? "Could not delete method.");
      setBusyId(null);
      return;
    }

    toast.success(msg ?? "Payment method removed.");
    setBusyId(null);
    router.refresh();
  };
console.log(methods)
  return (
    <div className="space-y-4 p-4 sm:p-6">
      {methods.length === 0 && (
        <div className="border rounded-xl p-4 text-sm text-muted-foreground bg-card">
          No payment methods yet.
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {methods.map((m) => (
          <div
            key={m.id}
            className="border rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white hover:shadow-sm transition"
          >
            <div className="flex items-start sm:items-center gap-3">
              <div className="rounded-lg bg-muted p-2 mt-0.5">
                <ProviderLogo method={m.method_type} />
              </div>
              <div>
                <p className="font-medium flex flex-wrap items-center gap-2">
                  {m.method_type.charAt(0).toUpperCase() + m.method_type.slice(1)}
                  {m.is_primary && <Badge variant="outline" className="rounded-full">Primary</Badge>}
                  <Badge
                    className={clsx(
                      "capitalize rounded-full",
                      m.status === "active" ? "bg-green-600" : "bg-gray-400"
                    )}
                  >
                    {m.status}
                  </Badge>
                </p>
                <p className="text-sm text-muted-foreground">
                  {m.params.account_name} • {maskNumber(m.params.account_number)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {!m.is_primary && (
                <ConfirmAction
                  triggerLabel="Set Primary"
                  title="Set this method as Primary?"
                  description="This will become your default withdrawal method."
                  confirmLabel="Yes, set primary"
                  onConfirm={() => setPrimary(m.id)}
                //   disabled={busyId === m.id}
                />
              )}

              <ConfirmAction
                triggerLabel={m.status === "active" ? "Deactivate" : "Activate"}
                title={`${m.status === "active" ? "Deactivate" : "Activate"} this method?`}
                description={m.status === "active" ? "You can activate it again later." : "This method will be marked active."}
                confirmLabel={m.status === "active" ? "Yes, deactivate" : "Yes, activate"}
                onConfirm={() => toggleActive(m.id)}
                // disabled={busyId === m.id}
              />

              <ConfirmAction
                triggerLabel="Remove"
                title="Remove payment method?"
                description="This action cannot be undone."
                confirmLabel="Yes, remove"
                destructive
                onConfirm={() => removeMethod(m.id)}
                // disabled={busyId === m.id}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

