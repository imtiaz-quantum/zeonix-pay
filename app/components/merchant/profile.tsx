"use client";
import React, { useMemo, useState } from "react";
import {
  Mail,
  Phone,
  Shield,
  User,
  Copy,
  Check,
  Hash,
  Edit3,
  BadgeCheck,
  X,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import ZeonixPayCard from "@/components/ui/zeonixpay-card";


const demoData = {
  id: 3,
  username: "demo",
  first_name: "demo",
  last_name: "demo",
  email: "demo@gmail.com",
  phone_number: "01775155760",
  status: "Active",
  role: "admin",
  pid: "be8e3258-0f53-4576-a006-bc48d2311d2a",
};

export type ProfileData = typeof demoData;

type EditableKeys =
  | "username"
  | "first_name"
  | "last_name"
  | "email"
  | "phone_number"
  | "status"; // role & pid are NOT editable

function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

function FieldRow({
  icon: Icon,
  label,
  value,
  onCopy,
  isEditable,
  onChange,
  name,
  placeholder,
  disabled,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number | null | undefined;
  onCopy?: (text: string) => void;
  isEditable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const doCopy = async () => {
    if (!onCopy || value == null) return;
    await navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={`flex items-start justify-between gap-4 py-3`}>
      <div className="flex min-w-0 items-start gap-3 w-full">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-600" />
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
          <div
            className="truncate text-base font-medium text-gray-900"
            title={String(value ?? "—")}
          >
            {isEditable && !disabled ? (
              <input
                name={name}
                className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-2 ring-transparent transition focus:border-violet-400 focus:ring-violet-200 disabled:cursor-not-allowed disabled:bg-gray-50"
                value={String(value ?? "")}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
              />
            ) : (
              <span className="text-slate-800">{value ?? "—"}</span>
            )}
          </div>
        </div>
      </div>
      {onCopy && !isEditable && (
        <button
          onClick={doCopy}
          className="inline-flex h-9 items-center gap-2 rounded-xl px-3 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="text-sm">{copied ? "Copied" : "Copy"}</span>
        </button>
      )}
    </div>
  );
}

export default function ProfilePage({ data }: { data: ProfileData }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newData, setNewData] = useState<ProfileData>(data);
  const [isSaving, setIsSaving] = useState(false);

  const fullName = useMemo(() => {
    const f = newData.first_name?.trim();
    const l = newData.last_name?.trim();
    if (f && l) return `${f} ${l}`;
    return f || l || newData.username || `User #${newData.id}`;
  }, [newData]);

  const initials = useMemo(() => {
    const f = newData.first_name?.trim?.()[0] ?? newData.username?.trim?.()[0] ?? "?";
    const l = newData.last_name?.trim?.()[0] ?? "";
    return (f + l).toUpperCase();
  }, [newData]);

  const statusTone =
    newData.status?.toLowerCase() === "active"
      ? "bg-green-50 text-green-700 ring-green-600/20"
      : newData.status?.toLowerCase() === "inactive"
        ? "bg-gray-50 text-gray-700 ring-gray-600/20"
        : "bg-amber-50 text-amber-700 ring-amber-600/20";

  const handleCopy = (text: string) => navigator.clipboard.writeText(text);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewData((prev) => ({ ...prev, [name]: value }));
  };

  const allowed = [
    "username",
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "status",
  ] as const satisfies readonly EditableKeys[];

  type Allowed = (typeof allowed)[number];
  // Compute diff of editable fields only
  function getChangedFields(

    original: ProfileData,
    updated: ProfileData
  ): Partial<Pick<ProfileData, Allowed>> {
    // Record form makes assignment type-safe without `any`
    const diff: Partial<Record<Allowed, ProfileData[Allowed]>> = {};

    for (const key of allowed) {
      const before = original[key];
      const after = updated[key];
      if (after !== before) {
        diff[key] = after;
      }
    }

    return diff;
  }
  const validate = () => {
    // quick client validations
    if (newData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (newData.phone_number && newData.phone_number.length < 6) {
      toast.error("Phone looks too short");
      return false;
    }
    if (newData.phone_number && newData.phone_number.length > 14) {
      toast.error("Phone must have less than 14 characters");
      return false;
    }
    return true;
  };
  console.log(data);

  const handleSave = async () => {
    if (!validate()) return;

    const payload = getChangedFields(data, newData);

    if (Object.keys(payload).length === 0) {
      toast("No changes to save");
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await toast.promise(
        fetch("/api/profile/update", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).then(async (r) => {
          if (!r.ok) throw new Error("Failed to update profile");
          console.log(r);

          return r.json().catch(() => null);
        }),
        {
          loading: "Updating profile...",
          success: <b>Profile updated successfully!</b>,
          error: <b>Failed to update profile.</b>,
        }
      );
      setIsEditing(false);
      router.refresh();
    } catch (e) {
    } finally {
      setIsSaving(false);
    }
  };

  return (

    <div className="mx-auto  sm:px-6 lg:px-8 space-y-6">
      {/* Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-200 text-lg font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-300">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{fullName}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-600/20 flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  <span>@{newData.username}</span>
                </Badge>
                <Badge className={`${statusTone}`}>{newData.status ?? "Unknown"}</Badge>
                <Badge className="bg-gray-50 text-gray-700 ring-gray-500/20 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Role: {newData.role}</span>
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setNewData(data); // revert
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-2xl bg-customViolet px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-customViolet/90 disabled:opacity-60"
                >
                  <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-2xl bg-customViolet px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-customViolet/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-900"
              >
                <Edit3 className="h-4 w-4" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Card */}
      <div
        className={` overflow-hidden rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 ${isEditing ? "ring-violet-200" : ""
          }`}
      >
        <div className="grid grid-cols-1 gap-2 space-x-6 md:grid-cols-2">
          <FieldRow
            icon={User}
            label="First name"
            value={newData.first_name}
            onCopy={handleCopy}
            isEditable={isEditing}
            onChange={handleChange}
            name="first_name"
            placeholder="Enter first name"
          />
          <FieldRow
            icon={User}
            label="Last name"
            value={newData.last_name}
            onCopy={handleCopy}
            isEditable={isEditing}
            onChange={handleChange}
            name="last_name"
            placeholder="Enter last name"
          />
          <FieldRow
            icon={Mail}
            label="Email"
            value={newData.email}
            onCopy={handleCopy}
            isEditable={isEditing}
            onChange={handleChange}
            name="email"
            placeholder="name@example.com"
          />
          <FieldRow
            icon={Phone}
            label="Phone"
            value={newData.phone_number}
            onCopy={handleCopy}
            isEditable={isEditing}
            onChange={handleChange}
            name="phone_number"
            placeholder="e.g. 017********"
          />
          <FieldRow
            icon={User}
            label="Username"
            value={newData.username}
            onCopy={handleCopy}
            isEditable={isEditing}
            onChange={handleChange}
            name="username"
            placeholder="Choose a username"
          />
          <FieldRow
            icon={BadgeCheck}
            label="Status"
            value={newData.status}
            onCopy={handleCopy}
            isEditable={isEditing}
            onChange={handleChange}
            name="status"
            placeholder="Active / Inactive"
          />
          {/* Read-only rows */}
          <FieldRow
            icon={Shield}
            label="Role"
            value={newData.role}
            isEditable={false}
            name="role"
          />
          <FieldRow icon={Hash} label="User ID" value={newData.id} isEditable={false} name="id" />
          <FieldRow icon={Hash} label="PID" value={newData.pid} isEditable={false} name="pid" />
        </div>

        {/* Sticky action bar for small screens while editing */}
        {isEditing && (
          <div className="pointer-events-auto sticky bottom-4 mt-6 flex items-center justify-end gap-3 rounded-2xl bg-white/80 p-3 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <button
              onClick={() => {
                setNewData(data);
                setIsEditing(false);
              }}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50"
            >
              <X className="h-4 w-4" /> Discard
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-xl bg-customViolet px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-customViolet/90 disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {data?.role === "Admin" && <ZeonixPayCard userRole="Admin"/>}
    </div>

  );
}
