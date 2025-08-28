"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

// ---------- Types from your sample ----------
export type Payout = {
  id: number
  store_name: string
  trx_id: string
  trx_uuid: string
  receiver_name: string
  receiver_number: string
  amount: string
  payment_method: string                    // e.g. "bkash"
  payment_details: { account_name: string; account_number: string }
  status: string                            // e.g. "success" | "pending" | "failed"
  created_at: string
  merchant: number
}

// ---------- Helpers ----------
const statusBg = (s: string) => {
  const x = (s || "").toLowerCase();
  if (["success", "active", "completed", "paid"].includes(x)) return "bg-green-600";
  if (["pending", "processing"].includes(x)) return "bg-orange-400";
  return "bg-red-600"; // failed / rejected / others
};

const maskLast4 = (v?: string) => (v ? `**** ${v.slice(-4)}` : "****")

const formatBDT = (raw: string) => {
  const n = parseFloat(raw)
  return isFinite(n)
    ? new Intl.NumberFormat("en-IN", { style: "currency", currency: "BDT" }).format(n)
    : raw
}

// ---------- Columns ----------
export const payoutColumns: ColumnDef<Payout>[] = [
  {
    accessorKey: "trx_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Transaction ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("trx_id") as string}</div>,
  },
  {
    accessorKey: "store_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Store
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "receiver",
    header: "Receiver",
    cell: ({ row }) => {
      const name = row.original.receiver_name
      const number = row.original.receiver_number
      return (
        <div className="space-y-0.5">
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{number}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left font-medium">{formatBDT(row.getValue("amount") as string)}</div>
    ),
  },
  {
    accessorKey: "payment_method",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Method
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const m = (row.getValue("payment_method") as string) || ""
      return <div className="capitalize">{m}</div>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    id: "payment_details",
    header: "Payment Details",
    cell: ({ row }) => {
      const det = row.original.payment_details
      return (
        <div className="space-y-0.5">
          <div className="text-sm">{det.account_name}</div>
          <div className="text-xs text-muted-foreground">{maskLast4(det.account_number)}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const s = (row.getValue("status") as string) ?? ""
      return <Badge className={`capitalize ${statusBg(s)}`}>{s}</Badge>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const iso = row.getValue("created_at") as string
      const d = new Date(iso)
      return <div>{isNaN(d.getTime()) ? iso : d.toLocaleString()}</div>
    },
  },
/*   {
    id: "actions",
    header: () => <div className="text-right font-semibold">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const rowData = row.original
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("View", rowData)} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Edit", rowData)} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Delete", rowData)} className="text-red-600 cursor-pointer">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  }, */
]
