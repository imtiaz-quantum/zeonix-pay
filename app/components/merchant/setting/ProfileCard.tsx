"use client";

import Image from "next/image";
import {
  Building2,
  Globe2,
  Phone,
  Shield,
  BadgeDollarSign,
  Copy,
  Check,
  Edit,
  Upload,
  ToggleRight,
} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

/* ---------------- Types ---------------- */

type MerchantData = {
  brand_name: string;
  whatsapp_number: string;
  domain_name: string; // e.g. "https://zenxone.com/"
  brand_logo: string | null; // URL or path returned by backend
  status: "Active" | "Inactive" | string;
  is_active: boolean;
  fees: string; // "10.00"
};

type UploadResponse = {
  ok?: boolean;
  message?: string;
  logoPath?: string;
  path?: string;
  url?: string;
  data?: { logoPath?: string; path?: string; url?: string };
  [k: string]: unknown;
};

type EditableKeys = "brand_name" | "whatsapp_number" | "domain_name" | "status";

/* --------------- Helpers --------------- */

function normalizeDomain(val: string) {
  const v = (val ?? "").trim();
  if (!v) return v;
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

function getChangedFields(
  original: Pick<MerchantData, EditableKeys>,
  updated: Pick<MerchantData, EditableKeys>
): Partial<Record<EditableKeys, string>> {
  const keys: EditableKeys[] = ["brand_name", "whatsapp_number", "domain_name", "status"];
  const diff: Partial<Record<EditableKeys, string>> = {};
  for (const k of keys) {
    if (original[k] !== updated[k]) diff[k] = updated[k];
  }
  return diff;
}

/* --------------- Component --------------- */

export default function ProfileCard({ data }: { data: MerchantData }) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);

  // editable fields (safe defaults to avoid null/undefined in inputs)
  const [newBrandName, setNewBrandName] = useState<string>(data.brand_name ?? "");
  const [newStatus, setNewStatus] = useState<string>(data.status ?? "Active");
  const [newWhatsApp, setNewWhatsApp] = useState<string>(data.whatsapp_number ?? "");
  const [newDomain, setNewDomain] = useState<string>(data.domain_name ?? "");

  // logo editing state
  const [newLogo, setNewLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(data.brand_logo ?? null);
  const [logoRemotePath, setLogoRemotePath] = useState<string | null>(data.brand_logo ?? null);
  const [isLogoDirty, setIsLogoDirty] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = (form: MerchantData) => {
    const n = (form.brand_name || "BIZ").trim();
    const parts = n.split(/\s+/);
    const first = parts[0]?.[0]?.toUpperCase() ?? "B";
    const second = parts[1]?.[0]?.toUpperCase() ?? "";
    return (first + second) || "B";
  };

  const statusPill = (s: string) =>
    s?.toLowerCase() === "active"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-rose-50 text-rose-700 ring-rose-200";

  const overlayText = logoRemotePath ? "Change logo" : "Update photo";
  const openFilePicker = () => fileInputRef.current?.click();

  const onSelectLogo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0] ?? null;
    setNewLogo(f);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
    if (f) {
      const url = URL.createObjectURL(f);
      setObjectUrl(url);
      setLogoPreview(url); // instant local preview
      setIsLogoDirty(true);
    }
  };

  // Save = upload to your API (which forwards to backend)
  const handleSaveLogo = async () => {
    if (!newLogo) {
      toast.error("Please choose a logo first.");
      return;
    }

    const formData = new FormData();
    formData.append("brand_logo", newLogo);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        body: formData, // no Content-Type header
      });

      const json = (await res.json()) as UploadResponse;
      if (!res.ok) throw new Error(json.message ?? "Upload failed");

      const returnedPath =
        json.logoPath ?? json.path ?? json.url ?? json.data?.logoPath ?? json.data?.path ?? json.data?.url;

      if (typeof returnedPath === "string" && returnedPath.length > 0) {
        setLogoRemotePath(returnedPath);
        setLogoPreview(returnedPath);
      }

      setIsLogoDirty(false);
      setNewLogo(null);
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        setObjectUrl(null);
      }

      toast.success("Logo updated!");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
    }
  };

  // Cancel = revert preview to last saved remote path
  const handleCancelLogo = () => {
    setNewLogo(null);
    setLogoPreview(logoRemotePath ?? null);
    setIsLogoDirty(false);
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      setObjectUrl(null);
    }
  };

  // Save only changed fields (plus brand_logo if changed)
  const handleEdit = async () => {
    const brand = (newBrandName ?? "").trim();
    const wa = (newWhatsApp ?? "").trim();
    const dom = normalizeDomain(newDomain ?? "");
    const stat = (newStatus ?? data.status ?? "Active").trim() || data.status;

    const updated: Pick<MerchantData, EditableKeys> = {
      brand_name: brand,
      whatsapp_number: wa,
      domain_name: dom,
      status: stat,
    };

    const original: Pick<MerchantData, EditableKeys> = {
      brand_name: data.brand_name ?? "",
      whatsapp_number: data.whatsapp_number ?? "",
      domain_name: data.domain_name ?? "",
      status: data.status ?? "Active",
    };

    const diffCore = getChangedFields(original, updated);

    // include brand_logo if it changed
    const diff: Partial<Record<EditableKeys | "brand_logo", string>> = { ...diffCore };
    if ((logoRemotePath ?? "") !== (data.brand_logo ?? "")) {
      diff.brand_logo = logoRemotePath ?? "";
    }

    if (Object.keys(diff).length === 0) {
      toast("No changes to save", { icon: "ℹ️" });
      return;
    }

    await toast.promise(
      fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // If your backend needs { merchant: diff }, wrap it accordingly:
        body: JSON.stringify(diff),
      }).then(async (response) => {
        if (!response.ok) throw new Error("Failed to update profile");
        setIsEditing(false);
        router.refresh();
      }),
      {
        loading: "Updating profile...",
        success: <b>Profile updated successfully!</b>,
        error: <b>Failed to update profile.</b>,
      }
    );
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
      <div className="px-6 pb-6 z-20 bg-customViolet">
        <div className="flex items-end justify-between z-30 pt-8 space-y-4 sm:space-y-0 sm:gap-4">
          {/* Brand logo */}
          <div className="flex items-end gap-4">
            <div className="relative group grid h-20 w-20 place-items-center rounded-2xl bg-white ring-1 ring-black/10 shadow -mt-6 overflow-hidden">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Brand Logo"
                  width={72}
                  height={72}
                  className="h-16 w-16 object-cover"
                />
              ) : (
                <div className="grid h-16 w-16 place-items-center rounded-xl bg-violet-100 text-violet-700 text-xl font-semibold">
                  {initials(data)}
                </div>
              )}

              {/* Hover overlay (click opens picker) */}
              <button
                onClick={openFilePicker}
                type="button"
                className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/40"
                aria-label={overlayText}
                title={overlayText}
              >
                <span className="text-xs font-semibold text-white px-2 py-1 rounded">
                  {overlayText}
                </span>
              </button>
            </div>

            <div className="pb-1">
              <h1 className="text-xl font-bold text-white">{data.brand_name || "—"}</h1>
              <div className="mt-1 inline-flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring ${statusPill(
                    data.status
                  )}`}
                >
                  <Shield className="h-3.5 w-3.5" />
                  {data.status}
                </span>
              </div>
            </div>
          </div>

          {/* Header buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Edit className="h-4 w-4" />
              {isEditing ? "Cancel" : "Edit"}
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onSelectLogo}
            />

            {/* Choose / Save / Cancel for logo */}
            <button
              onClick={openFilePicker}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Upload className="h-4 w-4" />
              {overlayText}
            </button>

            {isLogoDirty && (
              <>
                <button
                  onClick={handleSaveLogo}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm font-semibold hover:bg-emerald-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelLogo}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        <div className="space-y-4">
          {/* Brand Name (text) */}
          <Field
            icon={<Building2 className="h-4 w-4 text-slate-500" />}
            label="Brand Name"
            value={isEditing ? newBrandName : data.brand_name}
            onChange={(e) => setNewBrandName(e.currentTarget.value)}
            isEditable={isEditing}
            inputType="text"
            placeholder="e.g. Zeonix"
            maxLength={80}
          />
          {/* Domain (url) */}
          {/*    <Field
            icon={<Globe2 className="h-4 w-4 text-slate-500" />}
            label="Domain"
            value={isEditing ? newDomain : data.domain_name}
            onChange={(e) => setNewDomain(e.currentTarget.value)}
            isEditable={isEditing}
            inputType="url"
            placeholder="https://example.com"
            pattern="^https?://.+$"
          /> */}
          <Field
            icon={<Globe2 className="h-4 w-4 text-slate-500" />}
            label="Domain"
            value={data.domain_name}
            pattern="^https?://.+$"
          />
          {/* WhatsApp (tel) */}
          <Field
            icon={<Phone className="h-4 w-4 text-slate-500" />}
            label="WhatsApp"
            value={isEditing ? newWhatsApp : data.whatsapp_number}
            onChange={(e) => setNewWhatsApp(e.currentTarget.value)}
            isEditable={isEditing}
            inputType="tel"
            inputMode="tel"
            placeholder="+8801XXXXXXXXX"
            action={<CopyBtn text={data.whatsapp_number ?? ""} />}
          />
        </div>

        <div className="space-y-4">
          {/* Status (dropdown when editing) */}
          <Field
            icon={<Shield className="h-4 w-4 text-slate-500" />}
            label="Status"
            value={isEditing ? newStatus : data.status}
            onChange={(e) =>
              setNewStatus((e as React.ChangeEvent<HTMLSelectElement>).currentTarget.value)
            }
            isEditable={isEditing}
            isSelect
            selectOptions={["Active", "Inactive"]}
          />
          {/* Is Active (read-only view) */}
          <Field
            icon={<ToggleRight className="h-4 w-4 text-slate-500" />}
            label="Is Active"
            value={data.is_active ? "Active" : "Inactive"}
          />
          {/* Fees — ALWAYS read-only */}
          <Field
            icon={<BadgeDollarSign className="h-4 w-4 text-slate-500" />}
            label="Fees (%)"
            value={`${data.fees}%`}
            disabled
          />
        </div>
      </div>

      {isEditing && (
        <div className="px-6 py-3 mt-4 flex justify-end">
          <button
            onClick={handleEdit}
            className="inline-flex items-center gap-2 rounded-lg bg-customViolet hover:bg-customViolet/90 text-white font-semibold px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

/* --------------- Field & CopyBtn --------------- */

function Field({
  icon,
  label,
  value,
  onChange,
  isEditable,
  action,
  isSelect,
  selectOptions,
  inputType = "text",
  inputMode,
  placeholder,
  maxLength,
  pattern,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  isEditable?: boolean;
  action?: React.ReactNode;
  isSelect?: boolean;
  selectOptions?: string[];
  inputType?: React.HTMLInputTypeAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
}) {
  const safeValue = value ?? ""; // never pass null to inputs/selects

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="mb-1 flex items-center gap-2">
        {icon}
        <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        {isEditable ? (
          isSelect ? (
            <select
              className="w-full bg-transparent text-sm text-slate-900 outline-none border-b border-transparent focus:border-violet-300 transition"
              value={safeValue}
              onChange={onChange}
              disabled={disabled}
            >
              {(selectOptions ?? []).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="w-full bg-transparent text-sm text-slate-900 outline-none border-b border-transparent focus:border-violet-300 transition"
              value={safeValue}
              onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
              type={inputType}
              inputMode={inputMode}
              placeholder={placeholder}
              maxLength={maxLength}
              pattern={pattern}
              autoComplete="off"
              disabled={disabled}
            />
          )
        ) : (
          <span className="text-sm font-medium text-slate-800 break-all">
            {safeValue || "—"}
          </span>
        )}
        {action}
      </div>
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      onClick={onCopy}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
