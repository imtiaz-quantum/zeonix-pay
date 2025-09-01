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

export type Deposit = {
  id: number
  invoice_payment_id: string
  data: { key: string; code: string }
  method_payment_id: string
  customer_order_id: string
  customer_name: string
  customer_number: string
  customer_amount: string
  customer_email: string
  customer_address: string
  customer_description: string | null
  method: string            // e.g. "bkash"
  status: string            // e.g. "active" | "inactive" | "pending"
  pay_status: string        // e.g. "paid" | "unpaid" | "failed"
  transaction_id: string
  invoice_trxn: string
  extras: unknown | null
  created_at: string
  merchant: number
}


const statusBg = (s: string) => {
  const x = (s || "").toLowerCase();
  if (["success", "active", "completed", "paid"].includes(x)) return "bg-green-600";
  if (["pending", "processing"].includes(x)) return "bg-orange-400";
  return "bg-red-600"; // failed / rejected / others
};

export const depositColumns: ColumnDef<Deposit>[] = [
    {
    accessorKey: "customer_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Customer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
    {
    accessorKey: "method",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Method
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="capitalize">{row.getValue("method") as string}</div>,
  },
/*   {
    accessorKey: "invoice_payment_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Invoice Payment ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  }, */
  {
    accessorKey: "customer_number",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "customer_amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("customer_amount"))
      const formatted = isFinite(amount)
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(amount)
        : row.getValue("customer_amount")
      return <div className="text-left font-medium">{formatted as string}</div>
    },
  },
  {
    accessorKey: "transaction_id",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Transaction ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue("transaction_id") as string}</div>,
  },
/*   {
    accessorKey: "status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const s = (row.getValue("status") as string) ?? ""
      return <Badge variant={statusVariant(s)} className="capitalize">{s}</Badge>
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  }, */
  {
    accessorKey: "pay_status",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Pay Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const s = (row.getValue("pay_status") as string) ?? ""
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
