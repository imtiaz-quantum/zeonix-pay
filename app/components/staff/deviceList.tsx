"use client";

import React, { useState, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, RefreshCcw, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { Card } from "@/components/ui/card";
import { extractErrorMessage } from "@/app/lib/utils/extractErrorMessage";
import { useRouter, useSearchParams } from "next/navigation";

type Device = {
  id: number;
  device_name: string;
  device_key: string;
  device_pin: string;
  is_active: boolean;
  create_at: string;
  updated_ta: string;
  user: number;
};

type ApiResponse = {
  status: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  data: Device[];
};

function getPageRange(current: number, total: number, max = 7) {
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
  const half = Math.floor(max / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(total, start + max - 1);
  if (end - start + 1 < max) start = Math.max(1, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

const DeviceList = ({ deviceListPromise, currentPage }: { deviceListPromise: Promise<ApiResponse>; currentPage: number }) => {
  const initialData = use(deviceListPromise);
  const devices = initialData?.data;
  const router = useRouter();
  const searchParams = useSearchParams();

  // Dialog State
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmToggleOpen, setConfirmToggleOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    device_name: "",
    device_pin: "",
    is_active: true,
  });


  // Search & status filter
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all");

  const requiredFilled = addForm.device_name.trim() && addForm.device_pin.trim();

  // Handle Create Device
  const handleCreateDevice = async () => {
    const newDevice = {
      device_name: addForm.device_name,
      device_pin: addForm.device_pin,
      is_active: addForm.is_active,
    };
    const req = fetch("/api/admin/create-device", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDevice),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      return data;
    });

    await toast.promise(req, {
      loading: "Creating device...",
      success: "Device created successfully.",
      error: (e) => (e instanceof Error ? e.message : "Failed to create device."),
    });
    setAddOpen(false); // Close the dialog
    router.refresh();
  };

  // Handle Edit Device
  const handleEditDevice = async () => {
    if (selectedDevice) {
      const updatedDevice = {
        device_name: selectedDevice.device_name,
        device_pin: selectedDevice.device_pin,
      };
      const req = fetch(`/api/admin/device/${selectedDevice.device_key}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDevice),
      }).then(async (res) => {
        const data = await res.json().catch(() => ({} as unknown));
        if (!res.ok) {
          const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
          throw new Error(msg);
        }
        return data;
      });

      await toast.promise(req, {
        loading: "Updating device...",
        success: "Device updated successfully.",
        error: (e) => (e instanceof Error ? e.message : "Failed to update device."),
      });

      setEditOpen(false);
      router.refresh();
    }
  };

  // Handle Delete Device
  const handleDeleteDevice = async () => {
    if (selectedDevice) {
      const req = fetch(`/api/admin/device/${selectedDevice.device_key}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }).then(async (res) => {
        const data = await res.json().catch(() => ({} as unknown));
        if (!res.ok) {
          const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
          throw new Error(msg);
        }
        return data;
      });

      await toast.promise(req, {
        loading: "Deleting device...",
        success: "Device deleted successfully.",
        error: (e) => (e instanceof Error ? e.message : "Failed to delete device."),
      });

      setDeleteOpen(false);
      router.refresh();
    }
  };



  const handleStatusChange = async () => {
    const updatedDevice = {
      is_active: !selectedDevice?.is_active, // Toggle status
    };

    const req = fetch(`/api/admin/device/${selectedDevice?.device_key}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedDevice),
    }).then(async (res) => {
      const data = await res.json().catch(() => ({} as unknown));
      if (!res.ok) {
        const msg = extractErrorMessage(data) ?? `Request failed with ${res.status}`;
        throw new Error(msg);
      }
      return data;
    });

    await toast.promise(req, {
      loading: selectedDevice?.is_active ? "Deactivating device..." : "Activating device...",
      success: selectedDevice?.is_active ? "Device deactivated successfully." : "Device activated successfully.",
      error: (e) => (e instanceof Error ? e.message : "Failed to update device status."),
    });
    setConfirmToggleOpen(false);
    router.refresh();
  };


  // Server-backed pagination (stable)
  const pageSizeRef = useRef<number>(initialData?.data?.length || 1);
  useEffect(() => {
    if (initialData.next) {
      pageSizeRef.current = Math.max(pageSizeRef.current, initialData.data.length || 1);
    }
    if (!initialData.next && !initialData.previous) {
      pageSizeRef.current = initialData.data.length || 1;
    }
  }, [initialData.next, initialData.previous, initialData.data.length]);

  const pageSize = pageSizeRef.current || 1;
  const totalPages = Math.max(1, Math.ceil((initialData?.count ?? devices.length) / pageSize));
  const canPrev = currentPage > 1 && Boolean(initialData?.previous);
  const canNext = currentPage < totalPages && Boolean(initialData?.next);
  const pages = getPageRange(currentPage, totalPages, 7);

  const goToPage = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages);
    if (target === currentPage) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(target));
    router.push(`?${params.toString()}`);
  };

  // Filter devices locally (search + status)
  const filteredDevices = devices.filter((d) => {
    const matchesSearch = search
      ? d.device_name.toLowerCase().includes(search.toLowerCase()) ||
      d.device_key.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" ? true : statusFilter === "active" ? d.is_active : !d.is_active;

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="space-y-4 p-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Device List</h1>
          <p className="text-sm text-muted-foreground">All devices in your system.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-3">
        {/* Search */}
        <Input
          placeholder="Search by name, key..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-md"
          aria-label="Search devices"
        />
        <div className="flex items-center gap-2">
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
            className="bg-customViolet text-white hover:bg-customViolet/90"
            onClick={() => setAddOpen(true)}
          >
            Add Device
          </Button>
        </div>
      </div>

      <div className="rounded-sm border bg-white overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-customViolet bg-customViolet text-white">
              <TableHead className="text-white">Device Name</TableHead>
              <TableHead className="text-white">Device Key</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Created At</TableHead>
              <TableHead className="text-white">Updated At</TableHead>
              <TableHead className="text-white">User ID</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.length ? (
              filteredDevices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.device_name}</TableCell>
                  <TableCell>{device.device_key}</TableCell>
                  <TableCell>
                    <Badge className={clsx(device.is_active ? "bg-green-600" : "bg-red-600")}>
                      {device.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(device.create_at).toLocaleString()}</TableCell>
                  <TableCell>{new Date(device.updated_ta).toLocaleString()}</TableCell>
                  <TableCell>{device.user}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedDevice(device);
                          setEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedDevice(device);
                          setConfirmToggleOpen(true);
                        }}
                        aria-label="Toggle Status"
                      >
                        <RefreshCcw className={clsx("h-4 w-4", device.is_active ? "text-orange-400" : "text-green-500")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedDevice(device);
                          setDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>

                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">No devices available</TableCell>
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

      {/* Add Device Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Device</DialogTitle>
            <DialogDescription>Fill in the device details below to create a new device.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="device_name">Device Name</Label>
              <Input
                id="device_name"
                value={addForm.device_name}
                onChange={(e) => setAddForm({ ...addForm, device_name: e.target.value })}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="device_pin">Device Pin</Label>
              <Input
                id="device_pin"
                value={addForm.device_pin}
                onChange={(e) => setAddForm({ ...addForm, device_pin: e.target.value })}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select value={addForm.is_active ? "active" : "inactive"} onValueChange={(v) => setAddForm({ ...addForm, is_active: v === "active" })}>
                <SelectTrigger className="w-[160px]" aria-label="Device status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={!requiredFilled}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleCreateDevice} disabled={!requiredFilled} className="bg-customViolet hover:bg-customViolet/90 cursor-pointer">
              Create Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Device Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>Update device details below.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="device_name">Device Name</Label>
              <Input
                id="device_name"
                value={selectedDevice?.device_name}
                onChange={(e) =>
                  setSelectedDevice({ ...selectedDevice!, device_name: e.target.value })
                }
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="device_pin">Device Pin</Label>
              <Input
                id="device_pin"

                onChange={(e) =>
                  setSelectedDevice({ ...selectedDevice!, device_pin: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleEditDevice} className="bg-customViolet hover:bg-customViolet/90 cursor-pointer">
              Update Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the device:{" "}
              {selectedDevice?.device_name}?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleDeleteDevice} className="bg-red-600 hover:bg-red-600/90">
              Delete Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status change  Dialog */}
      <Dialog open={confirmToggleOpen} onOpenChange={setConfirmToggleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDevice?.is_active ? "Deactivate device?" : "Activate device?"}</DialogTitle>
            <DialogDescription>
              {selectedDevice
                ? `Are you sure you want to ${selectedDevice.is_active ? "deactivate" : "activate"} “${selectedDevice.device_name}”?`
                : "Are you sure?"}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleStatusChange} className="bg-red-600 hover:bg-red-600/90">
              {selectedDevice?.is_active ? "Deactivate device?" : "Activate device?"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



    </Card>
  );
};

export default DeviceList;
