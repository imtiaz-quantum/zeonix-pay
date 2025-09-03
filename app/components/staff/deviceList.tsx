"use client";

import React, { useState, useMemo, useRef, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TbPasswordUser } from "react-icons/tb";
import { Pencil, RefreshCcw, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { Card } from "@/components/ui/card";

type Device = {
    id: number;
    device_name: string;
    device_key: string;
    device_pin: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    user: number;
};

type ApiResponse = {
    status: boolean;
    count: number;
    next: string | null;
    previous: string | null;
    data: Device[];
};


const dummyData: Device[] = [
    {
        id: 1,
        device_name: "Samsung M14",
        device_key: "008311cdf82e4ba191e844436733f3cf",
        device_pin: "pbkdf2_sha256$1000000$wIty5AuVJyGNn3zNyZEjaf$b+9B8IsBgsSu6wS5W9LvIAmjqYh+gKJigmCWOXlaidQ=",
        is_active: true,
        created_at: "2025-09-03T11:46:29.955676+06:00",
        updated_at: "2025-09-03T11:46:29.955753+06:00",
        user: 3,
    },
    {
        id: 2,
        device_name: "iPhone 13",
        device_key: "a1b2c3d4e5f6789gh0ijklmnopqrs",
        device_pin: "pbkdf2_sha256$1000000$2FfK1Ls2Dsxvnf9g3tWZ7f5Jaz0zL9jD3ekR2diyZT0VgwWbLPzSYA==",
        is_active: false,
        created_at: "2025-09-01T12:00:00.000000+06:00",
        updated_at: "2025-09-01T12:00:00.000000+06:00",
        user: 4,
    },
];


const DeviceList = ({ deviceListPromise,
    currentPage,
}: {
    deviceListPromise: Promise<ApiResponse>;
    currentPage: number;
}) => {

      const res = use(deviceListPromise);
      const devices = res?.data;

    // Dialog State
    const [addOpen, setAddOpen] = useState(false);
    const [addForm, setAddForm] = useState({
        device_name: "",
        device_key: "",
        device_pin: "",
        is_active: true,
    });
    // Search & status filter
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<"active" | "inactive" | "all">("all");

    const requiredFilled = addForm.device_name.trim() && addForm.device_key.trim() && addForm.device_pin.trim();

    // Handle Create Device
    const handleCreateDevice = () => {
        const newDevice = {
            id: devices.length + 1,
            device_name: addForm.device_name,
            device_key: addForm.device_key,
            device_pin: addForm.device_pin,
            is_active: addForm.is_active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: 3, // Dummy user ID for now
        };
        toast.success("Device created successfully!");
        setAddOpen(false); // Close the dialog
    };

    return (
        <Card className="space-y-4 p-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Device List</h1>
                    <p className="text-sm text-muted-foreground">All device in your system.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
                {/* Search */}
                <Input
                    placeholder="Search by StoreID, name, email, phone, brand, username..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="sm:max-w-md"
                    aria-label="Search users"
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
                  {/*           <TableHead className="text-white">Device Pin</TableHead> */}
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white">Created At</TableHead>
                            <TableHead className="text-white">Updated At</TableHead>
                            <TableHead className="text-white">User ID</TableHead>
                            <TableHead className="text-white">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {devices.length ? (
                            devices.map((device) => (
                                <TableRow key={device.id}>
                                    <TableCell>{device.device_name}</TableCell>
                                    <TableCell>{device.device_key}</TableCell>
                                  {/*   <TableCell>{device.device_pin}</TableCell> */}
                                    <TableCell>
                                        <Badge className={clsx(device.is_active ? "bg-green-600" : "bg-red-600")}>
                                            {device.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(device.created_at).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(device.updated_at).toLocaleString()}</TableCell>
                                    <TableCell>{device.user}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <RefreshCcw className="h-4 w-4" />
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
                            <Label htmlFor="device_key">Device Key</Label>
                            <Input
                                id="device_key"
                                value={addForm.device_key}
                                onChange={(e) => setAddForm({ ...addForm, device_key: e.target.value })}
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
                        <Button onClick={handleCreateDevice} disabled={!requiredFilled}>
                            {requiredFilled ? "Create Device" : "Fill all fields"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default DeviceList;
