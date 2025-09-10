"use client"
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import clsx from "clsx";
import { Landmark, Smartphone, Coins } from "lucide-react";
import toast from "react-hot-toast";

type Method = "bank" | "mobileBanking" | "crypto" | null;

type SavedPaymentMethod = {
  id: string;
  method: Exclude<Method, null>;
  details: string;
  isPrimary: boolean;
  meta?: Record<string, unknown>;
};

type PaymentMethod = {
  id: number;
  method_type: "bkash" | "nagad" | "rocket" | "upay" | "bank" | "crypto";
  params: { account_name: string; account_number: string };
  status: string; // "active" | "deactive" | "Active"...
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  merchant: number;
};

const methodIconMap: Record<Exclude<Method, null>, React.ComponentType<{ className?: string }>> = {
  bank: Landmark,
  mobileBanking: Smartphone,
  crypto: Coins,
};

const methodLabel: Record<Exclude<Method, null>, string> = {
  bank: "Bank",
  mobileBanking: "Mobile Banking",
  crypto: "Crypto",
};

const maskLast4 = (v?: string) => (v ? `**** ${v.slice(-4)}` : "****");
const mapMethodTypeToUI = (t: PaymentMethod["method_type"]): Exclude<Method, null> =>
  t === "bank" ? "bank" : t === "crypto" ? "crypto" : "mobileBanking";

const mapApiToSaved = (m: PaymentMethod): SavedPaymentMethod => {
  const method = mapMethodTypeToUI(m.method_type);
  const last4 = maskLast4(m.params?.account_number);
  const details =
    method === "mobileBanking"
      ? `${m.method_type.toUpperCase()} ${last4}`
      : method === "bank"
      ? `${m.params?.account_name || "Bank"} ${last4}`
      : `Crypto ${last4}`;

  return {
    id: String(m.id),
    method,
    details,
    isPrimary: m.is_primary,
    meta:
      method === "mobileBanking"
        ? { mobileProvider: m.method_type, phoneNumber: m.params?.account_number }
        : method === "bank"
        ? { holderName: m.params?.account_name, accountNumber: m.params?.account_number }
        : { cryptoMethod: "binance", cryptoId: m.params?.account_number },
  };
};

const Submit_request = ({ data }: { data: PaymentMethod[] }) => {
  // Disable Bank & Crypto
  const disabledMethods: Record<Exclude<Method, null>, boolean> = {
    bank: true,
    mobileBanking: false,
    crypto: true,
  };

  // ACTIVE only (case-insensitive)
  const activeSaved: SavedPaymentMethod[] = useMemo(() => {
    const activeOnly = (data ?? []).filter((m) => String(m.status).toLowerCase() === "active");
    return activeOnly.map(mapApiToSaved);
  }, [data]);

  // Find global primary among active
  const primarySaved = useMemo(() => activeSaved.find((m) => m.isPrimary), [activeSaved]);

  // Compute default method from primary or first available (prefer mobile)
  const defaultMethod = useMemo<Exclude<Method, null> | null>(() => {
    const fromPrimary = primarySaved?.method ?? null;
    if (fromPrimary && !disabledMethods[fromPrimary]) return fromPrimary;

    const hasMobile = activeSaved.some((m) => m.method === "mobileBanking");
    if (hasMobile && !disabledMethods.mobileBanking) return "mobileBanking";

    const hasBank = activeSaved.some((m) => m.method === "bank");
    if (hasBank && !disabledMethods.bank) return "bank";

    const hasCrypto = activeSaved.some((m) => m.method === "crypto");
    if (hasCrypto && !disabledMethods.crypto) return "crypto";

    return null;
  }, [activeSaved, primarySaved, disabledMethods]);

  // Controlled method state (kept in sync with defaultMethod)
  const [paymentMethod, setPaymentMethod] = useState<Method>(defaultMethod);
  useEffect(() => {
    setPaymentMethod(defaultMethod);
  }, [defaultMethod]);

  // Eligible list for the chosen type
  const eligibleSaved = useMemo(() => {
    if (!paymentMethod || disabledMethods[paymentMethod]) return [];
    return activeSaved.filter((m) => m.method === paymentMethod);
  }, [paymentMethod, activeSaved, disabledMethods]);

  // Auto-select primary (or first) within the chosen method
  const [selectedSavedId, setSelectedSavedId] = useState<string>("");
  useEffect(() => {
    if (!paymentMethod) {
      setSelectedSavedId("");
      return;
    }
    if (eligibleSaved.length > 0) {
      const p = eligibleSaved.find((m) => m.isPrimary);
      setSelectedSavedId(p?.id ?? eligibleSaved[0].id);
    } else {
      setSelectedSavedId("");
    }
  }, [paymentMethod, eligibleSaved]);

  // Amount + submit
  const [amount, setAmount] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmitWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSavedId || !amount) return;

    const payload = { amount: String(amount), payment_method: Number(selectedSavedId) };

    await toast.promise(
      (async () => {
        setSubmitting(true);
        const res = await fetch("/api/merchant/withdraw-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message ?? "Withdraw request failed");
        return json?.message ?? "Withdraw request submitted!";
      })(),
      {
        loading: "Submitting request...",
        success: (msg) => <b>{msg}</b>,
        error: (err) => <b>{err.message}</b>,
      }
    ).finally(() => {
      setSubmitting(false);
      setAmount("");
    });
  };

  // UI helpers
  const TypeIcon = ({ type, className }: { type: Exclude<Method, null>; className?: string }) => {
    const Icon = methodIconMap[type];
    return <Icon className={clsx("h-4 w-4 text-muted-foreground", className)} />;
  };

  const SavedIcon = ({ saved, className }: { saved?: SavedPaymentMethod; className?: string }) => {
    if (!saved) return null;
    let src = "", alt = "";

    if (saved.method === "mobileBanking") {
      const prov = String(saved.meta?.mobileProvider || "").toLowerCase();
      if (prov === "bkash") { src = "/bkash.png"; alt = "Bkash"; }
      else if (prov === "nagad") { src = "/nagad.jpg"; alt = "Nagad"; }
      else if (prov === "rocket") { src = "/rocket.png"; alt = "Rocket"; }
      else if (prov === "upay") { src = "/upay.png"; alt = "Upay"; }
    } else if (saved.method === "crypto") {
      const cm = String(saved.meta?.cryptoMethod || "").toLowerCase();
      if (cm === "binance") { src = "/binance.png"; alt = "Binance"; }
      else if (cm === "bybit") { src = "/bybit.png"; alt = "Bybit"; }
      else if (cm === "trc20") { src = "/trc20.png"; alt = "TRC20"; }
    }

    if (src) return <Image src={src} alt={alt} width={16} height={16} className={clsx("h-4 w-4", className)} />;
    const Icon = methodIconMap[saved.method];
    return <Icon className={clsx("h-4 w-4 text-muted-foreground", className)} />;
  };

  const radioItem = (id: Exclude<Method, null>, label: string) => {
    const disabled =
      (id === "bank" && disabledMethods.bank) ||
      (id === "mobileBanking" && disabledMethods.mobileBanking) ||
      (id === "crypto" && disabledMethods.crypto);

    return (
      <Label
        htmlFor={id}
        className={clsx(
          "flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition",
          "bg-white hover:bg-accent hover:text-accent-foreground",
          "sm:min-h-[56px]",
          disabled && "opacity-50 cursor-not-allowed hover:bg-white hover:text-inherit"
        )}
      >
        <RadioGroupItem value={id} id={id} disabled={disabled} />
        <TypeIcon type={id} />
        <span className="text-sm sm:text-base">{label}</span>
      </Label>
    );
  };

  return (
    <CardContent className="space-y-6 p-4 sm:p-6">
      {/* Step 1: Select payment type */}
      <div className="space-y-2">
        <Label className="block text-sm sm:text-base">Select Payment Method</Label>
        <RadioGroup
          onValueChange={(v) => setPaymentMethod((v as Method) || null)}
          value={paymentMethod || ""}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          {radioItem("bank", "Bank")}
          {radioItem("mobileBanking", "Mobile Banking")}
          {radioItem("crypto", "Crypto")}
        </RadioGroup>
      </div>

      {/* Step 2: Pick a saved method + amount */}
      {paymentMethod && (
        <form className="space-y-4" onSubmit={onSubmitWithdraw}>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm sm:text-base">
              <TypeIcon type={paymentMethod as Exclude<Method, null>} />
              Select Saved {methodLabel[paymentMethod as Exclude<Method, null>]}
            </Label>

            <Select
              value={selectedSavedId}
              onValueChange={setSelectedSavedId}
              disabled={eligibleSaved.length === 0}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue
                  placeholder={
                    eligibleSaved.length === 0
                      ? `No saved ${methodLabel[paymentMethod as Exclude<Method, null>]} found`
                      : `Select a saved ${methodLabel[paymentMethod as Exclude<Method, null>]}`
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {eligibleSaved.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <span className="flex items-center gap-2">
                      <SavedIcon saved={m} />
                      <span>
                        {m.details} {m.isPrimary ? "(Primary)" : ""}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm sm:text-base">Amount</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!selectedSavedId}
              className="rounded-xl"
            />
          </div>

          <Button
            className="w-full bg-customViolet hover:bg-customViolet/90 rounded-xl"
            disabled={!selectedSavedId || amount === "" || submitting}
            type="submit"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </Button>

          {paymentMethod && eligibleSaved.length === 0 && (
            <p className="text-xs text-muted-foreground">
              You don’t have any saved {methodLabel[paymentMethod as Exclude<Method, null>]} yet.
              Use the “Manage payment methods” page to add some.
            </p>
          )}
        </form>
      )}
    </CardContent>
  );
};

export default Submit_request;
