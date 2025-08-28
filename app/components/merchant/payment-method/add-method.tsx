"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Landmark, Smartphone, Coins } from "lucide-react";
import { MdOutlinePayment } from "react-icons/md";
import clsx from "clsx";
import PaymentMethodsList from "./list";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import PaymentMethodsSkeleton from "../../skeletons/PaymentMethodsSkeleton";

type Method = "bank" | "mobileBanking" | "crypto";

type BankMeta = {
  holderName: string;
  accountNumber: string;
  bankName: string;
  branchName?: string;
};

type MobileBankingMeta = {
  mobileProvider?: string;
  accountType: string;
  phoneNumber: string;
};

type CryptoMeta = {
  cryptoMethod?: string;
  cryptoId: string;
};

type MethodType = "bkash" | "nagad" | "rocket" | "upay" | "bank" | "crypto";

export type PaymentMethod = {
  id: number;
  method_type: MethodType;
  params: {
    account_name: string;
    account_number: string;
  };
  status: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  merchant: number;
};

function getProviderAsset(
  method: Method,
  meta?: BankMeta | MobileBankingMeta | CryptoMeta
): { src?: string; alt?: string } {
  if (method === "mobileBanking") {
    const p = (meta as MobileBankingMeta)?.mobileProvider?.toLowerCase();
    if (p === "bkash") return { src: "/bkash.png", alt: "Bkash" };
    if (p === "nagad") return { src: "/nagad.jpg", alt: "Nagad" };
  }
  if (method === "crypto") {
    const c = (meta as CryptoMeta)?.cryptoMethod?.toLowerCase();
    if (c === "binance") return { src: "/binance.png", alt: "Binance" };
    if (c === "bybit") return { src: "/bybit.png", alt: "Bybit" };
    if (c === "trc20") return { src: "/trc20.png", alt: "TRC20" };
  }
  return {};
}

const methodIconMap: Record<Method, React.ComponentType<{ className?: string }>> = {
  bank: Landmark,
  mobileBanking: Smartphone,
  crypto: Coins,
};

function ProviderLogo({
  method,
  meta,
  className,
}: {
  method: Method;
  meta?: BankMeta | MobileBankingMeta | CryptoMeta;
  className?: string;
}) {
  const { src, alt } = getProviderAsset(method, meta);
  if (src) {
    return (
      <Image
        src={src}
        alt={alt || "provider"}
        width={20}
        height={20}
        className={clsx("h-5 w-5", className)}
      />
    );
  }
  const Fallback = methodIconMap[method];
  return <Fallback className={clsx("h-5 w-5 text-muted-foreground", className)} />;
}
const AddMethod = ({ data }: { data: PaymentMethod[] }) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [method, setMethod] = useState<Method>("bank");
  const [makePrimary, setMakePrimary] = useState<boolean>(false);
  // Bank
  const [holderName, setHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [branchName, setBranchName] = useState("");
  // Mobile banking
  const [mobileProvider, setMobileProvider] = useState<string | undefined>();
  const [accountType, setAccountType] = useState<string>("personal");
  const [phoneNumber, setPhoneNumber] = useState("");
  // Crypto
  const [cryptoMethod, setCryptoMethod] = useState<string | undefined>();
  const [cryptoId, setCryptoId] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMakePrimary(false);
    setHolderName("");
    setAccountNumber("");
    setBankName("");
    setBranchName("");
    setMobileProvider(undefined);
    setAccountType("personal");
    setPhoneNumber("");
    setCryptoMethod(undefined);
    setCryptoId("");
  }, [method, open]);

  const detailsPreview = useMemo(() => {
    if (method === "bank") {
      const last4 = accountNumber.slice(-4);
      return bankName
        ? `${bankName} **** ${last4 || "••••"}`
        : `Bank **** ${last4 || "••••"}`;
    }
    if (method === "mobileBanking") {
      const last4 = phoneNumber.slice(-4);
      const label = mobileProvider?.charAt(0).toUpperCase() + (mobileProvider?.slice(1) || "");
      return `${label || "Mobile"} **** ${last4 || "••••"}`;
    }
    const last4 = cryptoId.slice(-4);
    if (cryptoMethod === "trc20") return `TRC20 **** ${last4 || "••••"}`;
    if (cryptoMethod === "binance") return `Binance Pay ID **** ${last4 || "••••"}`;
    if (cryptoMethod === "bybit") return `Bybit Pay ID **** ${last4 || "••••"}`;
    return "Crypto";
  }, [method, bankName, accountNumber, mobileProvider, phoneNumber, cryptoMethod, cryptoId]);

  const saveDisabled =
    (method === "bank" && (!holderName || !accountNumber || !bankName)) ||
    (method === "mobileBanking" && (!mobileProvider || !phoneNumber)) ||
    (method === "crypto" && (!cryptoMethod || !cryptoId));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting || saveDisabled) return;

    const method_type =
      method === "bank"
        ? "bank"
        : method === "mobileBanking"
          ? (mobileProvider as "bkash" | "nagad" | "rocket" | "upay")
          : "crypto";

    const params = {
      account_name:
        method === "bank"
          ? holderName
          : method === "mobileBanking"
            ? holderName || accountType
            : holderName || "Crypto",
      account_number:
        method === "bank"
          ? accountNumber
          : method === "mobileBanking"
            ? phoneNumber
            : cryptoId,
    };

    setSubmitting(true);
    await toast.promise(
      (async () => {
        const res = await fetch("/api/merchant/payment-methods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ method_type, params, status: "active", is_primary: makePrimary }),
        });
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.message ?? "Could not create method.");
        return json?.message ?? "Method created!";
      })(),
      {
        loading: "Creating method...",
        success: (msg) => <b>{msg}</b>,
        error: (err) => <b>{err.message}</b>,
      }
    );
    setSubmitting(false);
    setOpen(false);
    router.refresh();
  };

  // ---------- Pagination (server-driven, stable) ----------
  // const totalPages = Math.max(1, Math.ceil((count || 0) / Math.max(1, pageSize)));
  // const canPrev = currentPage > 1;
  // const canNext = currentPage < totalPages;
  // const pages = getPageRange(currentPage, totalPages, 7);

  // const goToPage = (page: number) => {
  //   // Hard clamp + no-op if same page
  //   const target = Math.min(totalPages, Math.max(1, page));
  //   if (target === currentPage) return;

  //   const params = new URLSearchParams(searchParams?.toString() || "");
  //   params.set("page", String(target));
  //   // replace (not push) and scroll up for better UX
  //   router.replace(`?${params.toString()}`);
  //   if (typeof window !== "undefined") {
  //     window.scrollTo({ top: 0, behavior: "smooth" });
  //   }
  // };

  return (
    <Card className="rounded-2xl shadow-sm border">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-muted p-2">
            <MdOutlinePayment size={22} className="text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="font-headline text-lg sm:text-xl">Payment Methods</CardTitle>
            <CardDescription className="text-sm">
              Manage your connected bank, mobile, and crypto methods.
            </CardDescription>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-customViolet hover:bg-customViolet/90 cursor-pointer rounded-xl px-4">
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>Save a method for faster withdrawals.</DialogDescription>
            </DialogHeader>

            <form onSubmit={onSubmit} className="space-y-5">
              {/* Method picker */}
              {/* Method picker */}
              <div className="space-y-2">
                <Label className="block">Method</Label>
                <RadioGroup
                  value={method}
                  onValueChange={(v) => setMethod(v as Method)}
                  className="grid grid-cols-3 gap-3"
                >
                  {/* Bank - disabled */}
                  <Label
                    htmlFor="bank"
                    className={clsx(
                      "flex items-center gap-2 border rounded-md p-3 cursor-not-allowed opacity-50"
                    )}
                  >
                    <RadioGroupItem id="bank" value="bank" disabled />
                    <Landmark className="h-4 w-4 text-muted-foreground" />
                    Bank (Disabled)
                  </Label>

                  {/* Mobile Banking - enabled */}
                  <Label
                    htmlFor="mobileBanking"
                    className="flex items-center gap-2 border rounded-md p-3 cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <RadioGroupItem id="mobileBanking" value="mobileBanking" />
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    Mobile Banking
                  </Label>

                  {/* Crypto - disabled */}
                  <Label
                    htmlFor="crypto"
                    className={clsx(
                      "flex items-center gap-2 border rounded-md p-3 cursor-not-allowed opacity-50"
                    )}
                  >
                    <RadioGroupItem id="crypto" value="crypto" disabled />
                    <Coins className="h-4 w-4 text-muted-foreground" />
                    Crypto (Disabled)
                  </Label>
                </RadioGroup>
              </div>


              {/* Bank form */}
              {method === "bank" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="holderName">Account Holder Name</Label>
                      <Input id="holderName" value={holderName} onChange={(e) => setHolderName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="branchName">Branch Name</Label>
                      <Input id="branchName" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile banking form */}
              {method === "mobileBanking" && (
                <div className="space-y-3">
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={mobileProvider} onValueChange={setMobileProvider}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bkash">
                          <span className="flex items-center gap-2">
                            <Image src="/bkash.png" alt="Bkash" width={16} height={16} />
                            Bkash
                          </span>
                        </SelectItem>
                        <SelectItem value="nagad">
                          <span className="flex items-center gap-2">
                            <Image src="/nagad.jpg" alt="Nagad" width={16} height={16} />
                            Nagad
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Account Type</Label>
                    <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Account Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="e.g., 01700000000" required />
                  </div>
                </div>
              )}

              {/* Crypto form */}
              {method === "crypto" && (
                <div className="space-y-3">
                  <div>
                    <Label>Payment Method</Label>
                    <Select value={cryptoMethod} onValueChange={setCryptoMethod}>
                      <SelectTrigger className="pl-9">
                        <SelectValue placeholder="Select Payment Method type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="binance">
                          <span className="flex items-center gap-2">
                            <Image src="/binance.png" alt="Binance" width={16} height={16} />
                            Binance
                          </span>
                        </SelectItem>
                        <SelectItem value="bybit">
                          <span className="flex items-center gap-2">
                            <Image src="/bybit.png" alt="Bybit" width={16} height={16} />
                            Bybit
                          </span>
                        </SelectItem>
                        <SelectItem value="trc20">
                          <span className="flex items-center gap-2">
                            <Image src="/trc20.png" alt="TRC20" width={16} height={16} />
                            TRC20
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cryptoId">{cryptoMethod === "trc20" ? "TRC20 ID" : "Pay ID"}</Label>
                    <Input
                      id="cryptoId"
                      value={cryptoId}
                      onChange={(e) => setCryptoId(e.target.value)}
                      placeholder={cryptoMethod === "trc20" ? "e.g., Txxxxxxxxxxxxxxxxxxxx" : "e.g., 123456789 / user@example.com"}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Primary & Preview */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Switch checked={makePrimary} onCheckedChange={setMakePrimary} id="makePrimary" />
                  <Label htmlFor="makePrimary">Make Primary</Label>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ProviderLogo
                    method={method}
                    meta={
                      method === "bank"
                        ? { holderName, accountNumber, bankName, branchName }
                        : method === "mobileBanking"
                          ? { mobileProvider, accountType, phoneNumber }
                          : { cryptoMethod, cryptoId }
                    }
                  />
                  <span>
                    Preview: <span className="font-medium">{detailsPreview}</span>
                  </span>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting || saveDisabled} className="bg-customViolet rounded-xl">
                  {submitting ? "Saving..." : "Save Method"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      {/* List */}
      <Suspense fallback={<PaymentMethodsSkeleton/>}>
        <PaymentMethodsList data={data} />
      </Suspense>

      {/* Numbered Pagination */}
      {/*       <div className="flex items-center justify-center sm:justify-between py-4 px-4">
        <div className="hidden sm:block" />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canPrev}
            className="rounded-xl"
          >
            Previous
          </Button>

          {pages[0] !== 1 && (
            <>
              <Button variant="outline" size="sm" onClick={() => goToPage(1)} className="rounded-xl">
                1
              </Button>
              {pages[0] > 2 && <span className="px-1">…</span>}
            </>
          )}

          {pages.map((p) => (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(p)}
              className={clsx(
                "rounded-xl",
                p === currentPage && "bg-customViolet text-white hover:bg-customViolet/90"
              )}
            >
              {p}
            </Button>
          ))}

          {pages[pages.length - 1] !== totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && <span className="px-1">…</span>}
              <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} className="rounded-xl">
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canNext}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:block" />
      </div> */}
    </Card>
  );
};

export default AddMethod;
