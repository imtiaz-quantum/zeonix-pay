"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { TbPasswordUser } from "react-icons/tb";

type ApiUser = {
  id: number | string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string; // "Active"/"Inactive"
  role: string;   // "Merchant", etc.
  pid?: string;
  merchant?: {
    brand_name?: string;
    whatsapp_number?: string;
    domain_name?: string;
    brand_logo?: string;
    status?: string;
    fees_type?: string;
    fees?: string;         // <— we’ll use this
    is_active?: boolean;
  };
};

type InitialPayload = {
  status: boolean;
  count: number;          // total items
  next: string | null;    // url or null
  previous: string | null;
  data: ApiUser[];        // current page items
};

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
  fees: string;           // <— added for edit & display
  brand_name?: string;
};

type Props = {
  initialData: InitialPayload;
  currentPage: number;
};

export default function UserListClient({ initialData, currentPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
      fees: u.merchant?.fees ?? "0.00",
      brand_name: u.merchant?.brand_name,
    }));
  }, [initialData]);

  // Search & status filter (client-side for current page items)
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
        (row.brand_name ?? "").toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  // Server-backed pagination controls
  const perPage = Math.max(1, initialData?.data?.length ?? 1);
  const totalPages = Math.max(1, Math.ceil((initialData?.count ?? rows.length) / perPage));
  const canPrev = Boolean(initialData?.previous) || currentPage > 1;
  const canNext = Boolean(initialData?.next);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

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

  // Add User form (now includes fees)
  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    phone_number: "",
    brand_name: "",
    fees: "", // <— new
  });
  const [showAddPassword, setShowAddPassword] = useState(false);

  const requiredFilled =
    addForm.first_name.trim() &&
    addForm.last_name.trim() &&
    addForm.email.trim() &&
    addForm.username.trim() &&
    addForm.password.trim().length >= 6 &&
    addForm.phone_number.trim() &&
    addForm.brand_name.trim() &&
    addForm.fees.trim();

  // Edit form: first_name, last_name, fees (no balance/deposit/payout)
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    fees: "",
  });

  // ====== CREATE USER (POST) ======
  const createUser = async () => {
    if (!requiredFilled || creating) return;
    setCreating(true);

    const req = fetch("/api/merchant/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Backend can map fees into merchant.fees if needed
      body: JSON.stringify(addForm),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = data?.message || data?.error || data?.detail || `Request failed with ${res.status}`;
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
      fees: "",
    });

    router.refresh(); // re-fetch current page from server
  };

  // ====== OPEN EDIT ======
  const openEdit = (row: User) => {
    setSelected(row);
    setEditForm({
      first_name: row.first_name || "",
      last_name: row.last_name || "",
      fees: row.fees || "",
    });
    setEditOpen(true);
  };

  // ====== SAVE EDIT (PATCH merchant.fees) ======
  // The backend requested payload shape: { merchant: { fees: "15.00" } }
  const saveEdit = async () => {
    if (!selected) return;
    if (!selected.pid) {
      toast.error("Missing PID for this user.");
      return;
    }
    if (!editForm.fees.trim()) {
      toast.error("Fees is required.");
      return;
    }

    setIsUpdating(true);

    const payload = {
      merchant: {
        fees: String(editForm.fees),
      },
      // If later you want to update names as well, confirm backend shape and include them here.
      // first_name: editForm.first_name,
      // last_name: editForm.last_name,
    };

    const req = fetch(`/api/merchant/user/${selected.pid}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = data?.message || data?.error || data?.detail || `Request failed with ${res.status}`;
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
        const msg = data?.message || data?.error || data?.detail || `Request failed with ${res.status}`;
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
        const msg = data?.message || data?.error || data?.detail || `Request failed with ${res.status}`;
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

  return (
    <Card className="space-y-4 p-4">
      <div>
        <h1 className="text-xl font-semibold">Users List</h1>
        <p className="text-sm text-muted-foreground">All staff in your system.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by storeID, name, email, phone, or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-1/3"
          aria-label="Search users"
        />

        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "active" | "inactive" | "all")}>
            <SelectTrigger className="w-[160px]" aria-label="Filter by status">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="bg-customViolet text-white hover:bg-customViolet/90 hover:cursor-pointer"
            onClick={() => setAddOpen(true)}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border bg-white overflow-hidden">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="hover:bg-customViolet bg-customViolet text-white">
              <TableHead className="w-[12%] text-white">StoreID</TableHead>
              <TableHead className="w-[18%] text-white">Name</TableHead>
              <TableHead className="w-[18%] text-white">Email</TableHead>
              <TableHead className="w-[14%] text-white">Phone</TableHead>
              <TableHead className="w-[14%] text-white">Brand</TableHead>
              <TableHead className="w-[8%] text-white">Fees</TableHead>
              <TableHead className="w-[10%] text-white">Status</TableHead>
              <TableHead className="w-[16%] text-white text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell>{row.storeId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.brand_name ?? "—"}</TableCell>
                <TableCell className="text-center">{row.fees}</TableCell>
                <TableCell>
                  <Badge className={row.status === "active" ? "bg-green-600" : "bg-red-600"}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Edit */}
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Edit"
                      onClick={() => openEdit(row)}
                      aria-label="Edit"
                      className="cursor-pointer"
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
                      className="cursor-pointer"
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
                      className="cursor-pointer"
                    >
                      <RefreshCcw className={`h-4 w-4 ${row.status === "active" ? "text-orange-400" : "text-green-400"}`} />
                    </Button>
                    {/* NOTE: Delete action removed as requested */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-sm text-muted-foreground">
                  No users found on this page.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Server-backed Pagination */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => goToPage(Math.max(1, currentPage - 1))} disabled={!canPrev}>
          Previous
        </Button>
        <div className="flex items-center gap-2">
          <span>Page {currentPage}</span>
          <span>/</span>
          <span>{totalPages}</span>
        </div>
        <Button variant="outline" onClick={() => goToPage(currentPage + 1)} disabled={!canNext}>
          Next
        </Button>
      </div>

      {/* === Add User Dialog (POST + toast.promise) === */}
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

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={addForm.email}
                onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
              />
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
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={addForm.phone_number}
                  onChange={(e) => setAddForm((f) => ({ ...f, phone_number: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input
                  id="brand_name"
                  value={addForm.brand_name}
                  onChange={(e) => setAddForm((f) => ({ ...f, brand_name: e.target.value }))}
                />
              </div>
            </div>

            {/* NEW: Fees */}
            <div className="grid gap-1.5">
              <Label htmlFor="fees">Fees</Label>
              <Input
                id="fees"
                value={addForm.fees}
                onChange={(e) => setAddForm((f) => ({ ...f, fees: e.target.value }))}
                placeholder="e.g. 10.00"
              />
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

      {/* === Edit User Dialog (first_name, last_name, fees) === */}
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

            <div className="grid gap-1.5">
              <Label htmlFor="edit_fees">Fees</Label>
              <Input
                id="edit_fees"
                value={editForm.fees}
                onChange={(e) => setEditForm((f) => ({ ...f, fees: e.target.value }))}
                placeholder="e.g. 15.00"
              />
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
            <DialogDescription>
              Set a new password for {selected?.name ?? "user"}.
            </DialogDescription>
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
    </Card>
  );
}
