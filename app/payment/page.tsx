'use client';

import { useEffect, useState } from "react";
import { X, ShieldCheck, ChevronDown, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import BkashAgentFlow from "../components/BkashAgentFlow";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

// Define types for invoiceData
interface InvoiceData {
  invoice: {
    amount: number;
  };
  mechant_info: {
    brand_name: string;
    brand_logo: string;
  };
  payment_methods: string[];
}

type GatewayKey = "bkash-merchant" | "bkash-personal" | "bkash-agent" | "nagad-merchant" | "nagad-personal" | "nagad-agent" | "rocket-merchant" | "rocket-personal" | "rocket-agent";

export default function PaymentPage() {
  const [loading, setLoading] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<GatewayKey | null>(null);
  const [validInvoice, setValidInvoice] = useState(true); // To check if the invoice is valid
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null); // Store invoice data for rendering
  const searchParams = useSearchParams();
  const invoice_payment_id: string | null = searchParams.get('invoice_payment_id');

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const res = await fetch(`${process.env.BASE_URL}/get-payment/?invoice_payment_id=${invoice_payment_id}`, {
          cache: "no-store",
        });

        const data = await res.json();
        console.log("data:", data);

        if (res.ok && data.status) {
          setInvoiceData(data);
        } else {
          setValidInvoice(false); // Invalid invoice
        }
      } catch (error) {
        console.error("Error fetching invoice data:", error);
        setValidInvoice(false);
      }
    };

    fetchInvoiceData();
  }, [invoice_payment_id]);

  console.log(invoice_payment_id);

  // Safely access the data (with optional chaining)
  const invoice = invoiceData?.invoice;
  const mechant_info = invoiceData?.mechant_info;
  const payment_methods = invoiceData?.payment_methods;

  // ---- DUMMY merchant + invoice (replace with real data later) ----
  const merchant = {
    name: "PAYSTATION",
    logo: "/sefu_logo.jpeg",
    processorBrand: "/zeonix-logo.png",
  };

  const amount = 1250;
  const currency = "BDT";

  const onPay = async () => {
    if (!selectedGateway) return;

    if (selectedGateway.includes("nagad") || selectedGateway.includes("rocket")) {
      toast("This payment method is coming soon!", {
        icon: '👏',
      });
      return;
    }

    if (selectedGateway === "bkash-agent") return;

    setLoading(true);

    const base = process.env.BASE_URL;
    const path =
      selectedGateway === "bkash-merchant"
        ? "get-payment/bkash"
        : "get-payment/nagad";

    const url = `${base}/${path}/?invoice_payment_id=${encodeURIComponent(
      invoice_payment_id ?? ""
    )}&redirect=1`;

    await new Promise((r) => setTimeout(r, 200));
    window.location.href = url;
  };
  
   

  if (!validInvoice) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-red-500">Invalid Invoice Payment ID</h1>
          <p>The invoice you are trying to access could not be found.</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 w-full">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
          {/* top bar */}
          <div className="absolute right-3 top-3">
            <button
              aria-label="Close"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              onClick={() => alert("Close modal")}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* header */}
          <div className="px-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-violet-100 text-violet-700 font-semibold overflow-hidden">
                <Image src={mechant_info?.brand_logo || "/zeonix-logo.png"} alt="brand-logo" width={48} height={48} className="object-contain" />
              </div>
              <div className="flex-1">
                <div className="text-sm uppercase tracking-wider text-slate-500">Merchant</div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-900">{mechant_info?.brand_name || "Unknown Merchant"}</p>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    Invoice <span className="ml-1 font-semibold">{invoice_payment_id?.slice(0, 8)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pt-4 pb-2">
            <Divider />
          </div>

          {/* methods header */}
          <div className="px-6 pb-3">
            <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
              <Smartphone className="h-4 w-4 text-slate-500" />
              M-Banking
            </div>
          </div>

          {/* content */}
          <div className="px-4 pb-2 pt-2 w-full">
            {/* Gateway grid */}
            <OptionGrid
              selected={selectedGateway}
              onSelect={(key) => setSelectedGateway(key)}
              options={[
                { key: "bkash-merchant", name: "bKash (Merchant)", logo: "/geteway/bkash.svg" },
                { key: "bkash-personal", name: "bKash (Personal)", logo: "/geteway/bkash.svg" },
                { key: "bkash-agent", name: "bKash (Agent)", logo: "/geteway/bkash.svg" },
                { key: "nagad-merchant", name: "Nagad (Merchant)", logo: "/geteway/nagad.svg" },
                { key: "nagad-personal", name: "Nagad (Personal)", logo: "/geteway/nagad.svg" },
                { key: "nagad-agent", name: "Nagad (Agent)", logo: "/geteway/nagad.svg" },
                { key: "rocket-merchant", name: "Rocket (Merchant)", logo: "/geteway/rocket.svg" },
                { key: "rocket-personal", name: "Rocket (Personal)", logo: "/geteway/rocket.svg" },
                { key: "rocket-agent", name: "Rocket (Agent)", logo: "/geteway/Rocket.svg" },
              ]}
            />

            {/* Inline Agent flow — only when bkash-agent is selected */}
            <AnimatePresence mode="wait">
              {!selectedGateway?.includes("merchant") && (
                <motion.div
                  key="bkash-agent-flow"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4"
                >
                  <BkashAgentFlow
                    merchantName={merchant.name}
                    merchantInvoiceId={invoice_payment_id ?? ''}
                    merchantLogoSrc={"/geteway/bkash.svg"}
                    receiverMsisdn={"01770618575"}
                    amount={invoice?.amount || 0}
                    onClose={() => setSelectedGateway(null)}
                    onBack={() => setSelectedGateway(null)}
                    onVerifyTrx={async (trxId) => {
                      alert(`Verifying bKash Agent TRX: ${trxId}`);
                    }}
                    paymentMethod={selectedGateway?? ""}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* footer actions — hidden for bkash-agent */}
          {selectedGateway?.includes("merchant") && (
            <div className="space-y-3 px-6 pb-6 pt-2">
              <button
                onClick={onPay}
                disabled={loading || !selectedGateway}
                className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Spinner /> Processing…
                  </span>
                ) : (
                  <span>
                    Pay {currency} {invoice?.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}
                  </span>
                )}
              </button>

              <button
                onClick={() => setSelectedGateway(null)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              >
                Cancel
              </button>

              <div className="flex flex-col items-center gap-2 pt-1 text-center">
                <p className="text-xs text-slate-500">
                  By clicking Pay, you agree to our{" "}
                  <a href="#" className="font-medium text-violet-700 hover:underline">
                    Terms and Conditions
                  </a>
                  .
                </p>
                <div className="flex items-end justify-end gap-4 text-xs text-slate-500">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Securely processed by</span>
                  <Image src="/zeonix-logo.png" alt="processor_logo" width={80} height={80} className="object-contain" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* tiny receipt bar at bottom */}
        <div className="mx-auto mt-3 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <span>Need help?</span>
          <button className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 hover:bg-slate-50">
            <span>Contact support</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* --------------------------------- UI bits -------------------------------- */

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: { key: GatewayKey; name: string; logo?: string }[]; // Updated to use GatewayKey type
  selected: GatewayKey | null;
  onSelect: (k: GatewayKey) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => {
        const isActive = selected === opt.key;
        const tag =
          opt.key.startsWith("bkash-") || opt.key.startsWith("nagad-") || opt.key.startsWith("rocket-")
            ? opt.key.split("-")[1].toUpperCase()
            : null;

        return (
          <button
            key={opt.key}
            className={[
              "relative group flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-xl border bg-white text-slate-700 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
              isActive ? "border-violet-500 ring-1 ring-violet-200" : "border-slate-200 hover:shadow-md",
            ].join(" ")}
            onClick={() => onSelect(opt.key)}
          >
            {opt.logo ? (
              <Image src={opt.logo} alt={opt.name} width={70} height={70} className="object-contain" />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-md bg-slate-50 text-[10px] font-semibold text-slate-500">
                <span>{opt.name.split(" ").map((w) => w[0]).join("")}</span>
              </div>
            )}

            {tag && (
              <span className="absolute top-1 right-2 rounded bg-gray-200/90 px-1 text-[10px] font-semibold">
                {tag}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />;
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
