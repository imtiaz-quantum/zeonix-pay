"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Ledger } from "@/app/lib/types/all-transaction";


// ===== Helpers =====
const formatBDT = (val: unknown) => {
  const n = typeof val === "string" ? parseFloat(val) : Number(val);
  if (!isFinite(n)) return String(val ?? "");
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "BDT" }).format(n);
};

const statusBg = (s: string) => {
  const x = (s || "").toLowerCase();
  if (["success", "active", "completed"].includes(x)) return "bg-green-600";
  if (["pending", "processing"].includes(x)) return "bg-orange-400";
  return "bg-red-600"; // failed / rejected / others
};

const typeBg = (t: string) => {
  const x = (t || "").toLowerCase();
  if (x === "credit") return "bg-emerald-600";
  if (x === "debit") return "bg-rose-600";
  return "bg-gray-400";
};

// ===== Columns =====
export const baseColumns: ColumnDef<Ledger>[] = [
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
    accessorKey: "previous_balance",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Prev Balance
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatBDT(row.getValue("previous_balance"))}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{formatBDT(row.getValue("amount"))}</div>,
  },
  {
    accessorKey: "fee",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Fee
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{formatBDT(row.getValue("fee"))}</div>,
  },
  {
    accessorKey: "net_amount",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Net Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{formatBDT(row.getValue("net_amount"))}</div>,
  },
  {
    accessorKey: "current_balance",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Current Balance
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div className="font-medium">{formatBDT(row.getValue("current_balance"))}</div>,
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
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Created At
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const iso = row.getValue("created_at") as string;
      const d = new Date(iso);
      return <div>{isNaN(d.getTime()) ? iso : d.toLocaleString()}</div>;
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Source
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const t = (row.getValue("source") as string) ?? "";
      return (
        <Badge className={`capitalize ${typeBg(t)}`}>
          {t}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "tran_type",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Type
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const t = (row.getValue("tran_type") as string) ?? "";
      return (
        <Badge className={`capitalize ${typeBg(t)}`}>
          {t}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
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
      const s = (row.getValue("status") as string) ?? "";
      return (
        <Badge className={`capitalize ${statusBg(s)}`}>
          {s}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
/*   {
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
  }, */
];


export function getLedgerColumns(isAdmin: boolean): ColumnDef<Ledger>[] {
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
  } */

  return cols;
}