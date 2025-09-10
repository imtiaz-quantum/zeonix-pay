"use client";

import { useMemo, useState, useRef, useEffect, use, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { TbPasswordUser } from "react-icons/tb";
import clsx from "clsx";
import { extractErrorMessage } from "@/utils/extractErrorMessage";
import { UsersListResponse } from "@/lib/types/userList";


type User = {
  id: string;
  pid: string;
  storeId: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  role: string;
  deposit_fees: string;
  payout_fees: string;
  withdraw_fees: string;
  brand_name?: string;
  domain_name?: string;
  username?: string;
};

type Filters = {
  method?: string;
  status?: string;
  search?: string;
  created_at_before?: string; // YYYY-MM-DD
  created_at_after?: string;  // YYYY-MM-DD
};
const ALL = "__all__";

function getPageRange(current: number, total: number, max = 7) {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function UserListClient({
  userListPromise,
  currentPage,
  initialFilters,
}: {
  userListPromise: Promise<UsersListResponse>;
  currentPage: number;
  initialFilters: Filters;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialData = use(userListPromise);
  console.log(initialData)


  // Normalize server data to table rows
  const rows = useMemo<User[]>(() => {
    return (initialData?.data ?? []).map((u) => ({
      id: String(u.id),
      pid: u.pid ?? "",
      storeId: u.pid ? u.pid.slice(0, 8).toUpperCase() : "—",
      first_name: u.first_name ?? "",
      last_name: u.last_name ?? "",
      name: [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "—",
      email: u.email ?? "—",
      phone: u.phone_number ?? "—",
      status: /active/i.test(u.status) ? "active" : "inactive",
      role: u.role ?? "Merchant",
      deposit_fees: u.merchant?.deposit_fees ?? "0.00",
      payout_fees: u.merchant?.payout_fees ?? "0.00",
      withdraw_fees: u.merchant?.withdraw_fees ?? "0.00",
      brand_name: u.merchant?.brand_name ?? "",
      domain_name: u.merchant?.domain_name ?? "",
      username: u.username,
    }));
  }, [initialData]);

  // Search & status filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !term ||
        row.name.toLowerCase().includes(term) ||
        row.email.toLowerCase().includes(term) ||
        row.phone.includes(term) ||
        row.storeId.toLowerCase().includes(term) ||
        (row.brand_name ?? "").toLowerCase().includes(term) ||
        (row.domain_name ?? "").toLowerCase().includes(term) ||
        (row.username ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);


  // Dialog & form states
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const [creating, setCreating] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [selected, setSelected] = useState<User | null>(null);

  // Password reset state
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Add User form (includes fees)
  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    phone_number: "",
    brand_name: "",
    domain_name: "",
    deposit_fees: "",
    payout_fees: "",
    withdraw_fees: "",
  });
  const [showAddPassword, setShowAddPassword] = useState(false);

  const requiredFilled = Boolean(
    addForm.first_name.trim() &&
    addForm.last_name.trim() &&
    addForm.email.trim() &&
    addForm.username.trim() &&
    addForm.password.trim().length >= 4 &&
    addForm.phone_number.trim() &&
    addForm.brand_name.trim() &&
    addForm.domain_name.trim() &&
    addForm.deposit_fees.trim() &&
    addForm.payout_fees.trim() &&
    addForm.withdraw_fees.trim()
  );

  // Edit form: ALL fields
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone_number: "",
    brand_name: "",
    domain_name: "",
    deposit_fees: "",
    payout_fees: "",
    withdraw_fees: "",
  });

  // ====== CREATE USER (POST) ======
  const createUser = async () => {
    if (!requiredFilled || creating) return;
    setCreating(true);

    const req = fetch("/api/merchant/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      return data;
    });

    await toast.promise(req, {
      loading: "Creating user...",
      success: "User created successfully.",
      error: (e) => (e instanceof Error ? e.message : "Failed to create user."),
    });

    setCreating(false);
    setAddOpen(false);
    setAddForm({
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      phone_number: "",
      brand_name: "",
      domain_name: "",
      deposit_fees: "",
      payout_fees: "",
      withdraw_fees: "",
    });

    router.refresh();
  };

  // ====== OPEN EDIT ======
  const openEdit = (row: User) => {
    setSelected(row);
    setEditForm({
      first_name: row.first_name || "",
      last_name: row.last_name || "",
      email: row.email || "",
      username: row.username || "",
      phone_number: row.phone || "",
      brand_name: row.brand_name || "",
      domain_name: row.domain_name || "",
      deposit_fees: row.deposit_fees || "",
      payout_fees: row.payout_fees || "",
      withdraw_fees: row.withdraw_fees || "",
    });
    setEditOpen(true);
  };

  // ====== SAVE EDIT (PATCH) ======
  // Send user fields at top-level; fees under merchant.
  const saveEdit = async () => {
    if (!selected) return;
    if (!selected.pid) {
      toast.error("Missing PID for this user.");
      return;
    }

    // Simple validation
    if (!editForm.first_name.trim() || !editForm.last_name.trim() || !editForm.email.trim()) {
      toast.error("First name, last name and email are required.");
      return;
    }

    setIsUpdating(true);

    const payload = {
      first_name: editForm.first_name,
      last_name: editForm.last_name,
      email: editForm.email,
      username: editForm.username,
      phone_number: editForm.phone_number,
      merchant: {
        brand_name: editForm.brand_name,
        domain_name: editForm.domain_name,
        deposit_fees: editForm.deposit_fees,
        payout_fees: editForm.payout_fees,
        withdraw_fees: editForm.withdraw_fees,
      },
    };
    console.log(selected.pid)
    const req = fetch(`/api/merchant/user/${selected.pid}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      return data;
    });

    await toast.promise(req, {
      loading: "Updating user...",
      success: "User updated successfully.",
      error: (e) => (e instanceof Error ? e.message : "Failed to update user."),
    });

    setIsUpdating(false);
    setEditOpen(false);
    router.refresh();
  };

  // ====== PASSWORD RESET (POST) ======
  const openReset = (row: User) => {
    setSelected(row);
    setPassword("");
    setShowPassword(false);
    setResetOpen(true);
  };

  const confirmReset = async () => {
    if (!selected) return;
    if (!selected.pid) {
      toast.error("Missing PID for this user.");
      return;
    }
    if (password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsResetting(true);

    const req = fetch(`/api/merchant/user/${selected.pid}/password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset_password: password }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      return data;
    });

    await toast.promise(req, {
      loading: "Resetting password...",
      success: "Password reset successfully.",
      error: (e) => (e instanceof Error ? e.message : "Failed to reset password."),
    });

    setIsResetting(false);
    setResetOpen(false);
    setPassword("");
    router.refresh();
  };

  // ====== TOGGLE STATUS (POST) ======
  const openToggleConfirm = (row: User) => {
    setSelected(row);
    setConfirmToggleOpen(true);
  };

  const doToggle = async () => {
    if (!selected) return;
    if (!selected.pid) {
      toast.error("Missing PID for this user.");
      return;
    }

    const targetStatus = selected.status === "active" ? "disable" : "active";
    setIsToggling(true);

    const req = fetch(`/api/merchant/user/${selected.pid}/approved`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: targetStatus }),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      return data;
    });

    await toast.promise(req, {
      loading: selected.status === "active" ? "Deactivating user..." : "Activating user...",
      success: "User status updated.",
      error: (e) => (e instanceof Error ? e.message : "Failed to update status."),
    });

    setIsToggling(false);
    setConfirmToggleOpen(false);
    router.refresh();
  };



  // Server-backed pagination (stable)
      const filteredRows = filtered.length;
      const pageSize = 10; 
      const totalPages = Math.max(1, Math.ceil(filteredRows / pageSize)); 
  
      useEffect(() => {
          if (currentPage > totalPages) {
              const params = new URLSearchParams(searchParams?.toString() || "");
              params.set("page", String(totalPages)); 
              router.replace(`?${params.toString()}`, { scroll: false });
          }
      }, [currentPage, totalPages, router, searchParams]);
  
      const canPrev = currentPage > 1 && filteredRows > 0;
      const canNext = currentPage < totalPages && filteredRows > 0; 
      const pages = getPageRange(currentPage, totalPages, 7); 
  
      const goToPage = (page: number) => {
          const targetPage = Math.min(Math.max(1, page), totalPages);
          if (targetPage === currentPage) return;
          const params = new URLSearchParams(searchParams?.toString() || "");
          params.set("page", String(targetPage));
          router.push(`?${params.toString()}`);
      };
  


  // --- URL-driven filters (server-side) ---
  // debounce for text input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replaceDebounced = useCallback((url: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(url, { scroll: false });
    }, 350);
  }, [router]);

  const setParam = useCallback((key: string, value?: string, debounced = false) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value && value.trim() !== "") params.set(key, value);
    else params.delete(key);
    // reset page when filters change
    params.delete("page");
    const url = `?${params.toString()}`;
    if (debounced) replaceDebounced(url);
    else router.replace(url, { scroll: false });
  }, [router, searchParams, replaceDebounced]);



  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        {/* Search */}
        <Input
          placeholder="Filter by search…"
          defaultValue={initialFilters.search ?? ""}
          onChange={(e) => setParam("search", e.target.value, true)}
          className="md:max-w-sm flex-1"
        />
        <div className="flex items-center gap-2">
          {/* status */}
          <Select
            value={searchParams.get("status") ?? initialFilters.status ?? undefined}
            onValueChange={(v) => setParam("status", v === ALL ? undefined : v)}
          >
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All</SelectItem>   {/* ← no empty string */}
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Disable">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-customViolet text-white hover:bg-customViolet/90"
            onClick={() => setAddOpen(true)}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border bg-white overflow-hidden overflow-x-auto">
        <Table className="min-w-[1000px] text-sm">
          <TableHeader>
            <TableRow className="hover:bg-customViolet bg-customViolet text-white">
              <TableHead className="text-white">StoreID</TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Username</TableHead>
              <TableHead className="text-white">Email</TableHead>
              <TableHead className="text-white">Phone</TableHead>
              <TableHead className="text-white">Brand</TableHead>
              <TableHead className="text-white text-center">Deposit(%)</TableHead>
              <TableHead className="text-white text-center">Payout(%)</TableHead>
              <TableHead className="text-white text-center">Withdraw(%)</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell>{row.storeId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.username ?? "—"}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.brand_name ?? "—"}</TableCell>
                <TableCell className="text-center">{row.deposit_fees}</TableCell>
                <TableCell className="text-center">{row.payout_fees}</TableCell>
                <TableCell className="text-center">{row.withdraw_fees}</TableCell>
                <TableCell>
                  <Badge className={clsx("capitalize", row.status === "active" ? "bg-green-600" : "bg-red-600")}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex items-center gap-1">
                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit"
                      onClick={() => openEdit(row)}
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {/* Reset Password */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Reset Password"
                      onClick={() => openReset(row)}
                      aria-label="Reset Password"
                    >
                      <TbPasswordUser size={20} />
                    </Button>
                    {/* Toggle Status */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title={row.status === "active" ? "Deactivate" : "Activate"}
                      onClick={() => openToggleConfirm(row)}
                      aria-label="Toggle Status"
                    >
                      <RefreshCcw className={clsx("h-4 w-4", row.status === "active" ? "text-orange-400" : "text-green-500")} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={11} className="h-24 text-center text-sm text-muted-foreground">
                  No users found on this page.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Numbered Pagination */}
      <div className="flex items-center justify-center sm:justify-end py-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canPrev}
          >
            Previous
          </Button>

          {pages[0] !== 1 && (
            <>
              <Button variant="outline" size="sm" onClick={() => goToPage(1)}>
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
              className={p === currentPage ? "bg-customViolet text-white hover:bg-customViolet/90" : ""}
            >
              {p}
            </Button>
          ))}

          {pages[pages.length - 1] !== totalPages && (
            <>
              {pages[pages.length - 1] < totalPages - 1 && <span className="px-1">…</span>}
              <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)}>
                {totalPages}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={!canNext}
          >
            Next
          </Button>
        </div>
      </div>

      {/* === Add User Dialog === */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Fill the form and submit to create a new user.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={addForm.first_name}
                  onChange={(e) => setAddForm((f) => ({ ...f, first_name: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={addForm.last_name}
                  onChange={(e) => setAddForm((f) => ({ ...f, last_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div className="grid gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={addForm.email}
                  onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={addForm.phone_number}
                  onChange={(e) => setAddForm((f) => ({ ...f, phone_number: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={addForm.username}
                  onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showAddPassword ? "text" : "password"}
                    value={addForm.password}
                    onChange={(e) => setAddForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="At least 6 characters"
                  />
                  <button
                    type="button"
                    aria-label={showAddPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-2 flex items-center"
                    onClick={() => setShowAddPassword((s) => !s)}
                  >
                    {showAddPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  value={addForm.brand_name}
                  onChange={(e) => setAddForm((f) => ({ ...f, brand_name: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="domain_name">Domain Name (Ex: https://demo.com)</Label>
                <Input
                  id="domain_name"
                  value={addForm.domain_name}
                  onChange={(e) => setAddForm((f) => ({ ...f, domain_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="deposit_fees">Deposit fees (%)</Label>
                <Input
                  id="deposit_fees"
                  value={addForm.deposit_fees}
                  onChange={(e) => setAddForm((f) => ({ ...f, deposit_fees: e.target.value }))}
                  placeholder="e.g. 10.00"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="payout_fees">Payout fees (%)</Label>
                <Input
                  id="payout_fees"
                  value={addForm.payout_fees}
                  onChange={(e) => setAddForm((f) => ({ ...f, payout_fees: e.target.value }))}
                  placeholder="e.g. 10.00"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="withdraw_fees">Withdraw fees (%)</Label>
                <Input
                  id="withdraw_fees"
                  value={addForm.withdraw_fees}
                  onChange={(e) => setAddForm((f) => ({ ...f, withdraw_fees: e.target.value }))}
                  placeholder="e.g. 10.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer" disabled={creating}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={createUser}
              disabled={!requiredFilled || creating}
              title={!requiredFilled ? "Fill all fields (password ≥ 6 chars)" : "Create user"}
              className="bg-customViolet hover:bg-customViolet/90 cursor-pointer"
            >
              {creating ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Edit User Dialog (ALL fields) === */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user details below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edit_first_name">First Name</Label>
                <Input
                  id="edit_first_name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm((f) => ({ ...f, first_name: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit_last_name">Last Name</Label>
                <Input
                  id="edit_last_name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm((f) => ({ ...f, last_name: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit_username">Username</Label>
                <Input
                  id="edit_username"
                  value={editForm.username}
                  onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edit_phone">Phone Number</Label>
                <Input
                  id="edit_phone"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm((f) => ({ ...f, phone_number: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit_brand">Brand Name</Label>
                <Input
                  id="edit_brand"
                  value={editForm.brand_name}
                  onChange={(e) => setEditForm((f) => ({ ...f, brand_name: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="edit_domain_name">Domain Name</Label>
              <Input
                id="edit_domain_name"
                value={editForm.domain_name}
                onChange={(e) => setEditForm((f) => ({ ...f, domain_name: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="edit_deposit">Deposit fees (%)</Label>
                <Input
                  id="edit_deposit"
                  value={editForm.deposit_fees}
                  onChange={(e) => setEditForm((f) => ({ ...f, deposit_fees: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit_payout">Payout fees (%)</Label>
                <Input
                  id="edit_payout"
                  value={editForm.payout_fees}
                  onChange={(e) => setEditForm((f) => ({ ...f, payout_fees: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="edit_withdraw">Withdraw fees (%)</Label>
                <Input
                  id="edit_withdraw"
                  value={editForm.withdraw_fees}
                  onChange={(e) => setEditForm((f) => ({ ...f, withdraw_fees: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer" disabled={isUpdating}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={saveEdit}
              disabled={isUpdating}
              className="bg-customViolet hover:bg-customViolet/90 cursor-pointer"
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Reset Password Dialog === */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for {selected?.name ?? "user"}.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-2 flex items-center"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isResetting}>Cancel</Button>
            </DialogClose>
            <Button
              onClick={confirmReset}
              disabled={password.trim().length < 6 || isResetting}
              title={password.trim().length < 6 ? "Password must be at least 6 characters" : "Confirm reset"}
              className="bg-customViolet hover:bg-customViolet/90 cursor-pointer"
            >
              {isResetting ? "Please wait..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === Toggle Status Confirm === */}
      <AlertDialog open={confirmToggleOpen} onOpenChange={setConfirmToggleOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selected?.status === "active" ? "Deactivate user?" : "Activate user?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selected
                ? `Are you sure you want to ${selected.status === "active" ? "deactivate" : "activate"} “${selected.name}”?`
                : "Are you sure?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={doToggle}
              disabled={isToggling}
              className="bg-customViolet hover:bg-customViolet/90"
            >
              {isToggling ? "Please wait..." : "Yes"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
