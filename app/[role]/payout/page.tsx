/* "use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, ArrowUpDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DataTableFacetedFilter } from "@/app/components/data-table-faceted-filter"
import { columns } from "@/app/components/transferColums";

type Transaction = {
  storeId: string;
  paymentMethod: string;
  number: string;
  transactionId: string;
  updateTime: string;
  previousBalance: number;
  amount: number;
  currentBalance: number;
  status: "success" | "pending" | "failed";
  dateTime: string;
  comments: string;
};


const transactions: Transaction[] = [
  {
    storeId: "STR-001",
    paymentMethod: "Credit Card",
    number: "+1-202-555-0101",
    transactionId: "TXN10001",
    updateTime: "4242",
    previousBalance: 1200,
    amount: 200,
    currentBalance: 1000,
    status: "success",
    dateTime: "2023-08-01 10:00 AM",
    comments: "Paid in full",
  },
  {
    storeId: "STR-002",
    paymentMethod: "PayPal",
    number: "+1-202-555-0102",
    transactionId: "TXN10002",
    updateTime: "8931",
    previousBalance: 1000,
    amount: 150,
    currentBalance: 850,
    status: "pending",
    dateTime: "2023-08-02 11:15 AM",
    comments: "Awaiting confirmation",
  },
  {
    storeId: "STR-003",
    paymentMethod: "Bank Transfer",
    number: "+1-202-555-0103",
    transactionId: "TXN10003",
    updateTime: "6723",
    previousBalance: 850,
    amount: 300,
    currentBalance: 550,
    status: "success",
    dateTime: "2023-08-03 02:45 PM",
    comments: "Urgent processing",
  },
  {
    storeId: "STR-004",
    paymentMethod: "Stripe",
    number: "+1-202-555-0104",
    transactionId: "TXN10004",
    updateTime: "0912",
    previousBalance: 550,
    amount: 450,
    currentBalance: 100,
    status: "failed",
    dateTime: "2023-08-04 09:30 AM",
    comments: "Card declined",
  },
  {
    storeId: "STR-005",
    paymentMethod: "Checking Account",
    number: "+1-202-555-0105",
    transactionId: "TXN10005",
    updateTime: "3333",
    previousBalance: 100,
    amount: 100,
    currentBalance: 0,
    status: "success",
    dateTime: "2023-08-05 04:00 PM",
    comments: "Final installment",
  },
  {
    storeId: "STR-006",
    paymentMethod: "Savings Account",
    number: "+1-202-555-0106",
    transactionId: "TXN10006",
    updateTime: "9988",
    previousBalance: 300,
    amount: 75,
    currentBalance: 225,
    status: "success",
    dateTime: "2023-08-06 01:25 PM",
    comments: "Promo applied",
  },
  {
    storeId: "STR-007",
    paymentMethod: "UPI",
    number: "+1-202-555-0107",
    transactionId: "TXN10007",
    updateTime: "5619",
    previousBalance: 225,
    amount: 25,
    currentBalance: 200,
    status: "pending",
    dateTime: "2023-08-07 12:10 PM",
    comments: "UPI delay",
  },
  {
    storeId: "STR-008",
    paymentMethod: "Debit Card",
    number: "+1-202-555-0108",
    transactionId: "TXN10008",
    updateTime: "2121",
    previousBalance: 200,
    amount: 80,
    currentBalance: 120,
    status: "success",
    dateTime: "2023-08-08 03:40 PM",
    comments: "Standard transaction",
  },
];




const statuses = [
    { value: "success", label: "Success" },
    { value: "pending", label: "Pending" },
    { value: "failed", label: "Failed" },
    { value: "processing", label: "Processing" },
]

export default function Page() {
  const [data] = React.useState(() => [...transactions])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>
          A list of recent transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
            <div className="flex items-center py-4 gap-2">
                <Input
                placeholder="Filter by transactionId..."
                value={(table.getColumn("transactionId")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                    table.getColumn("transactionId")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
                />
                 {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={statuses}
                    />
                )}
                <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                        return (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                            }
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                        )
                    })}
                </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border overflow-hidden">
                <Table>
                <TableHeader className="bg-customViolet hover:bg-customViolet text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-customViolet">
                        {headerGroup.headers.map((header) => {
                        return (
                            <TableHead key={header.id} className="text-white">
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </TableHead>
                        )
                        })}
                    </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                        key={row.id}
                        className=""
                        data-state={row.getIsSelected() && "selected"}
                        >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                            </TableCell>
                        ))}
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                        >
                        No results.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
                </div>
            </div>
            </div>
      </CardContent>
    </Card>
  )
}
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPayoutList } from "@/app/lib/api/merchant/payout";
import PayoutTable from "@/app/components/PayoutTable";
import { Suspense } from "react";
import DepositTableSkeleton from "@/app/components/skeletons/DepositTableSkeleton";

export default async function Page() {
  const payout = await getPayoutList();
  const payoutListPromise = getPayoutList();
  console.log(payout);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>A list of recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<DepositTableSkeleton/>}>
          <PayoutTable payoutListPromise={payoutListPromise} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
