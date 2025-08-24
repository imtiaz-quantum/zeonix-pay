"use client";

import Image from "next/image";
import {
    Building2, Globe2, Phone, Shield, BadgeDollarSign, Copy, Check, Edit, Upload, ToggleRight
} from "lucide-react";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type MerchantData = {
    brand_name: string;
    whatsapp_number: string;
    domain_name: string; // e.g. "https://zenxone.com/"
    brand_logo: string | null; // URL or path returned by backend
    status: "Active" | "Inactive" | string;
    is_active: boolean;
    fees: string; // "10.00" (we display `${fees}%`)
};

export default function ProfileCard({ data }: { data: MerchantData }) {
    const [isEditing, setIsEditing] = useState(false);
    const [newBrandName, setNewBrandName] = useState(data.brand_name);
    const [newFees, setNewFees] = useState(data.fees);
    const [newStatus, setNewStatus] = useState(data.status);
    const [newLogo, setNewLogo] = useState<File | null>(null);

    // Live preview (local object URL) and persisted path/URL from backend
    const [logoPreview, setLogoPreview] = useState<string | null>(data.brand_logo);
    const [logoRemotePath, setLogoRemotePath] = useState<string | null>(data.brand_logo);

    const router = useRouter();
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

    const openFilePicker = () => fileInputRef.current?.click();

    const onSelectLogo: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const f = e.target.files?.[0] ?? null;
        setNewLogo(f);
        if (f) setLogoPreview(URL.createObjectURL(f)); // instant local preview
    };

    // Uploads image file to your API (which forwards to backend)
    const handleUploadLogo = async () => {
        if (!newLogo) {
            toast.error("Please choose a logo first.");
            return;
        }

        const formData = new FormData();
        formData.append("brand_logo", newLogo); // <-- important key name

        try {
            const res = await fetch("/api/profile/update", {
                method: "POST",
                body: formData,  // no Content-Type header
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json?.message || "Upload failed");

            toast.success("Logo uploaded!");
            console.log("Response:", json);
        } catch (err: any) {
            toast.error(err.message || "Upload failed");
        }
    };

    // Sends only JSON fields to your API (no file)
    const handleEdit = async () => {
        const payload = {

            brand_name: newBrandName,
            fees: newFees,
            status: newStatus,
            // optionally include backend-returned path/URL (if your upstream expects it here)
            brand_logo: logoRemotePath ?? data.brand_logo ?? null,

        };

        toast.promise(
            fetch("/api/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
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
                        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white ring-1 ring-black/10 shadow -mt-6 overflow-hidden">
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
                        </div>
                        <div className="pb-1">
                            <h1 className="text-xl font-bold text-white">{data.brand_name || "—"}</h1>
                            <div className="mt-1 inline-flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ring ${statusPill(data.status)}`}>
                                    <Shield className="h-3.5 w-3.5" />
                                    {data.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Header Buttons */}
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

                        <button
                            onClick={openFilePicker}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Upload className="h-4 w-4" />
                            Choose Logo
                        </button>
                        <button
                            onClick={handleUploadLogo}
                            className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Upload className="h-4 w-4" />
                            Upload Logo
                        </button>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
                <div className="space-y-4">
                    <Field
                        icon={<Building2 className="h-4 w-4 text-slate-500" />}
                        label="Brand Name"
                        value={isEditing ? newBrandName : data.brand_name}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        isEditable={isEditing}
                    />
                    <Field
                        icon={<Globe2 className="h-4 w-4 text-slate-500" />}
                        label="Domain"
                        value={data.domain_name}
                        action={<CopyBtn text={data.domain_name} />}
                    />
                    <Field
                        icon={<Phone className="h-4 w-4 text-slate-500" />}
                        label="WhatsApp"
                        value={data.whatsapp_number}
                        action={<CopyBtn text={data.whatsapp_number} />}
                    />
                </div>
                <div className="space-y-4">
                    <Field
                        icon={<Shield className="h-4 w-4 text-slate-500" />}
                        label="Status"
                        value={isEditing ? newStatus : data.status}
                        onChange={(e) => setNewStatus(e.target.value)}
                        isEditable={isEditing}
                    />
                    <Field
                        icon={<ToggleRight className="h-4 w-4 text-slate-500" />}
                        label="Is Active"
                        value={data.is_active ? "Active" : "Inactive"}
                    />
                    <Field
                        icon={<BadgeDollarSign className="h-4 w-4 text-slate-500" />}
                        label="Fees (%)"
                        value={isEditing ? newFees : `${data.fees}%`}
                        onChange={(e) => setNewFees(e.target.value)}
                        isEditable={isEditing}
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

/* ------------------------------------------------------------------ */
/* Helper components (same as your originals)                          */
/* ------------------------------------------------------------------ */
function Field({
    icon,
    label,
    value,
    onChange,
    isEditable,
    action,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    isEditable?: boolean;
    action?: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-slate-200 p-3">
            <div className="mb-1 flex items-center gap-2">
                {icon}
                <span className="text-xs uppercase tracking-wider text-slate-500">{label}</span>
            </div>
            <div className="mt-1 flex items-center justify-between">
                {isEditable ? (
                    <input
                        className="text-sm text-slate-800 outline-none ring-2 ring-transparent focus:ring-violet-200 w-full"
                        value={value}
                        onChange={onChange}
                    />
                ) : (
                    <span className="text-sm font-medium text-slate-800 break-all">{value || "—"}</span>
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
        } catch { }
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
