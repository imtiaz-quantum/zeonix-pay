"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

export type Transaction = {
  id: number,
  merchant: number
  paymentDetails: { account_name: string; account_number: string }
  amount: string
  status: string          // "success" | "pending" | "failed" | "processing" | "rejected"
  message: string
  trx_id: string
  trx_uuid: string
  created_at: string
  updated_at: string
  payment_method: number
}

const statusBg = (s: string) => {
  const x = (s || "").toLowerCase();
  if (["success", "active", "completed", "paid"].includes(x)) return "bg-green-600";
  if (["pending", "processing"].includes(x)) return "bg-orange-400";
  return "bg-red-600"; // failed / rejected / others
};

export const baseColumns: ColumnDef<Transaction>[] = [
  /*   {
      accessorKey: "merchant",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Merchant ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("merchant") as string}</div>,
    }, */

  {
    // snake_case -> readable label via accessorFn
    accessorKey: "paymentMethod",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Payment Method
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const id = row.getValue("paymentMethod") as number
      return <div className="text-center">{id}</div> // map to a label if you have a lookup
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
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      // change currency code if needed
      const formatted = isFinite(amount)
        ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BDT' }).format(amount)
        : row.getValue("amount")
      return <div className="text-left font-medium">{formatted as string}</div>
    },
  },
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
    id: "payment_details",
    header: "Payment Details",
    cell: ({ row }) => {
      const det = row.original.paymentDetails ?? {}
      return (
        <div className="space-y-0.5">
          <div className="text-sm">{det.account_name?.toLocaleUpperCase() ?? ""}</div>
          <div className="text-xs text-muted-foreground">{(det.account_number ?? "")}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "message",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Message
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Updated At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const iso = row.getValue("updated_at") as string
      const d = new Date(iso)
      return <div>{isNaN(d.getTime()) ? iso : d.toLocaleString()}</div>
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
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Edit", rowData)} className="cursor-pointer">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => console.log("Delete", rowData)} className="text-red-600 cursor-pointer">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }, */
]


export function getReportColumns(isAdmin: boolean): ColumnDef<Transaction>[] {
  const cols = [...baseColumns];

/*   if (isAdmin) {
    cols.push({
      id: "actions",
      header: () => <div className="text-right font-semibold">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const rowData = row.original;
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
        );
      },
    });
  }
 */
  return cols;
}