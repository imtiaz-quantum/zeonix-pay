"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
    fees?: string;
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
  storeId: string;
  name: string;
  email: string;
  phone: string;
  balance: string;
  depositFee: string;
  payoutFee: string;
  status: "active" | "inactive";
  role: string;
};

type Props = {
  initialData: InitialPayload;
  currentPage: number;
};

export default function UserListClient({ initialData, currentPage }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams(); // if you later add more query params

  // Normalize server data to table rows
  const rows = useMemo<User[]>(() => {
    return (initialData?.data ?? []).map((u) => ({
      id: String(u.id),
      storeId: u.pid ? u.pid.slice(0, 8).toUpperCase() : "—",
      name: [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || "—",
      email: u.email ?? "—",
      phone: u.phone_number ?? "—",
      balance: "$0",              // not provided by this API; display placeholder or map real field if exists
      depositFee: "0",            // not provided; adjust if you have fields
      payoutFee: "0",             // not provided; adjust if you have fields
      status: /active/i.test(u.status) ? "active" : "inactive",
      role: u.role ?? "Merchant",
    }));
  }, [initialData]);

  // Search & status filter (client-side only for the current page items)
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
        row.storeId.toLowerCase().includes(term);
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, statusFilter]);

  // Real (server) pagination controls
  const perPage = Math.max(1, initialData?.data?.length ?? 1);
  const totalPages = Math.max(1, Math.ceil((initialData?.count ?? rows.length) / perPage));
  const canPrev = Boolean(initialData?.previous) || currentPage > 1;
  const canNext = Boolean(initialData?.next);

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(page));
    router.push(`?${params.toString()}`);
  };

  // Dialog & form states kept from your previous UI (edit/reset/toggle/delete local only)
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);

  const [form, setForm] = useState<Omit<User, "id">>({
    storeId: "",
    name: "",
    email: "",
    phone: "",
    balance: "",
    depositFee: "",
    payoutFee: "",
    status: "active",
    role: "",
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [addForm, setAddForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    phone_number: "",
    brand_name: "",
  });
  const [showAddPassword, setShowAddPassword] = useState(false);
  const requiredFilled =
    addForm.first_name.trim() &&
    addForm.last_name.trim() &&
    addForm.email.trim() &&
    addForm.username.trim() &&
    addForm.password.trim().length >= 6 &&
    addForm.phone_number.trim() &&
    addForm.brand_name.trim();

  // POST create + refresh
  const createUser = async () => {
    if (!requiredFilled || creating) return;
    setCreating(true);

    const req = fetch("/api/merchant/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as any));
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
    });

    // Re-run the server component -> refetch the current page
    router.refresh();
  };

  // Handlers (local-only versions preserved)
  const openEdit = (row: User) => {
    setSelected(row);
    setForm({
      storeId: row.storeId,
      name: row.name,
      email: row.email,
      phone: row.phone,
      balance: row.balance,
      depositFee: row.depositFee,
      payoutFee: row.payoutFee,
      status: row.status,
      role: row.role,
    });
    setEditOpen(true);
  };
  const saveEdit = () => setEditOpen(false);
  const openReset = (row: User) => { setSelected(row); setPassword(""); setShowPassword(false); setResetOpen(true); };
  const confirmReset = () => setResetOpen(false);
  const openToggleConfirm = (row: User) => { setSelected(row); setConfirmToggleOpen(true); };
  const doToggle = () => setConfirmToggleOpen(false);
  const openDeleteConfirm = (row: User) => { setSelected(row); setConfirmDeleteOpen(true); };
  const doDelete = () => setConfirmDeleteOpen(false);

  return (
    <Card className="space-y-4 p-4">
      {/* Remove if Toaster is already mounted globally */}
      <Toaster position="top-right" />

      <div>
        <h1 className="text-xl font-semibold">Users List</h1>
        <p className="text-sm text-muted-foreground">All staff in your system.</p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Search by storeID, name, email or phone..."
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
          <Button className="bg-customViolet text-white hover:bg-customViolet/90 hover:cursor-pointer" onClick={() => setAddOpen(true)}>
            Add User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-sm border bg-white overflow-hidden">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="hover:bg-customViolet bg-customViolet text-white">
              <TableHead className="w-[15%] text-white">StoreID</TableHead>
              <TableHead className="w-[20%] text-white">Name</TableHead>
              <TableHead className="w-[20%] text-white">Email</TableHead>
              <TableHead className="w-[15%] text-white">Phone</TableHead>
              <TableHead className="w-[10%] text-white">Balance</TableHead>
              <TableHead className="w-[10%] text-white">Deposit (%)</TableHead>
              <TableHead className="w-[10%] text-white">Payout (%)</TableHead>
              <TableHead className="w-[10%] text-white">Status</TableHead>
              <TableHead className="w-[15%] text-white text-left">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((row) => (
              <TableRow key={row.id} className="hover:bg-gray-50">
                <TableCell>{row.storeId}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.balance}</TableCell>
                <TableCell className="text-center">{row.depositFee}</TableCell>
                <TableCell className="text-center">{row.payoutFee}</TableCell>
                <TableCell>
                  <Badge className={row.status === "active" ? "bg-green-600" : "bg-red-600"}>
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" title="Edit" onClick={() => openEdit(row)} aria-label="Edit" className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Reset Password" onClick={() => openReset(row)} aria-label="Reset Password" className="cursor-pointer">
                      <TbPasswordUser size={20} />
                    </Button>
                    <Button variant="ghost" size="icon" title={row.status === "active" ? "Deactivate" : "Activate"} onClick={() => openToggleConfirm(row)} aria-label="Toggle Status" className="cursor-pointer">
                      <RefreshCcw className={`h-4 w-4 ${row.status === "active" ? "text-orange-400" : "text-green-400"}`} />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete" onClick={() => openDeleteConfirm(row)} aria-label="Delete" className="cursor-pointer">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center text-sm text-muted-foreground">
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
                <Input id="first_name" value={addForm.first_name} onChange={(e) => setAddForm((f) => ({ ...f, first_name: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input id="last_name" value={addForm.last_name} onChange={(e) => setAddForm((f) => ({ ...f, last_name: e.target.value }))} />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={addForm.username} onChange={(e) => setAddForm((f) => ({ ...f, username: e.target.value }))} />
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
                <Input id="phone_number" value={addForm.phone_number} onChange={(e) => setAddForm((f) => ({ ...f, phone_number: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input id="brand_name" value={addForm.brand_name} onChange={(e) => setAddForm((f) => ({ ...f, brand_name: e.target.value }))} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer" disabled={creating}>Cancel</Button>
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

          {/* === Edit User Dialog === */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Modify user information, then click Save.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="email-edit">Email</Label>
              <Input id="email-edit" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="balance">Balance</Label>
              <Input id="balance" value={form.balance} onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))} />
            </div>
            <div className="flex gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="depositFee">Deposit (%)</Label>
                <Input id="depositFee" value={form.depositFee} onChange={(e) => setForm((f) => ({ ...f, depositFee: e.target.value }))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="payoutFee">Payout (%)</Label>
                <Input id="payoutFee" value={form.payoutFee} onChange={(e) => setForm((f) => ({ ...f, payoutFee: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => setForm((f) => ({ ...f, status: v as "active" | "inactive" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <Button onClick={saveEdit} className="bg-customViolet hover:bg-customViolet/90 cursor-pointer">Save</Button>
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
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={confirmReset}
              disabled={password.trim().length < 6}
              title={password.trim().length < 6 ? "Password must be at least 6 characters" : "Confirm reset"}
              className="bg-customViolet hover:bg-customViolet/90 cursor-pointer"
            >
              Confirm
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
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={doToggle} className="bg-customViolet hover:bg-customViolet/90">
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === Delete Confirm === */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              {selected
                ? `This will permanently remove “${selected.name}”. You can’t undo this action.`
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={doDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
