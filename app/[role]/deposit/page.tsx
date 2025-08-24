// "use client"

// import * as React from "react"
// import {
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { ChevronDown } from "lucide-react"
// import { DataTableFacetedFilter } from "@/app/components/data-table-faceted-filter"
// import { columns } from "@/app/components/columns";
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { CalendarIcon } from "lucide-react"
// import { format, parse } from "date-fns"

// type Transaction = {
//   storeId: string;
//   ipAddress: string;
//   transactionId: string;
//   name: string;
//   email: string;
//   amount: number;
//   paymentMethod: string;
//   dateTime: string;
//   status: "success" | "pending" | "failed";
//   previousBalance: number;
//   currentBalance: number;
// };

// const transactions: Transaction[] = [
//   {
//     storeId: "STR-001",
//     ipAddress: "192.168.1.10",
//     transactionId: "TXN12345",
//     name: "Liam Johnson",
//     email: "liam@example.com",
//     amount: 250.0,
//     paymentMethod: "Credit Card",
//     dateTime: "2023-06-23 10:30 AM",
//     status: "success",
//     previousBalance: 1000.0,
//     currentBalance: 750.0,
//   },
//   {
//     storeId: "STR-002",
//     ipAddress: "192.168.1.11",
//     transactionId: "TXN12346",
//     name: "Olivia Smith",
//     email: "olivia@example.com",
//     amount: 150.0,
//     paymentMethod: "PayPal",
//     dateTime: "2023-06-24 01:15 PM",
//     status: "success",
//     previousBalance: 750.0,
//     currentBalance: 600.0,
//   },
//   {
//     storeId: "STR-003",
//     ipAddress: "192.168.1.12",
//     transactionId: "TXN12347",
//     name: "Noah Williams",
//     email: "noah@example.com",
//     amount: 350.0,
//     paymentMethod: "Bank Transfer",
//     dateTime: "2023-06-25 09:00 AM",
//     status: "pending",
//     previousBalance: 600.0,
//     currentBalance: 600.0,
//   },
//   {
//     storeId: "STR-004",
//     ipAddress: "192.168.1.13",
//     transactionId: "TXN12348",
//     name: "Emma Brown",
//     email: "emma@example.com",
//     amount: 450.0,
//     paymentMethod: "Credit Card",
//     dateTime: "2023-06-26 03:45 PM",
//     status: "success",
//     previousBalance: 600.0,
//     currentBalance: 150.0,
//   },
//   {
//     storeId: "STR-005",
//     ipAddress: "192.168.1.14",
//     transactionId: "TXN12349",
//     name: "James Jones",
//     email: "james@example.com",
//     amount: 550.0,
//     paymentMethod: "Stripe",
//     dateTime: "2023-06-27 08:20 AM",
//     status: "failed",
//     previousBalance: 150.0,
//     currentBalance: 150.0,
//   },
//   {
//     storeId: "STR-006",
//     ipAddress: "192.168.1.15",
//     transactionId: "TXN54321",
//     name: "Alice Wonderland",
//     email: "alice@example.com",
//     amount: 100.0,
//     paymentMethod: "Checking Account",
//     dateTime: "2023-07-01 02:00 PM",
//     status: "success",
//     previousBalance: 150.0,
//     currentBalance: 50.0,
//   },
//   {
//     storeId: "STR-007",
//     ipAddress: "192.168.1.16",
//     transactionId: "TXN54322",
//     name: "Bob Builder",
//     email: "bob@example.com",
//     amount: 75.5,
//     paymentMethod: "Savings Account",
//     dateTime: "2023-07-02 11:30 AM",
//     status: "pending",
//     previousBalance: 50.0,
//     currentBalance: 50.0,
//   },
//   {
//     storeId: "STR-008",
//     ipAddress: "192.168.1.17",
//     transactionId: "TXN54323",
//     name: "Charlie Chocolate",
//     email: "charlie@example.com",
//     amount: 200.0,
//     paymentMethod: "Checking Account",
//     dateTime: "2023-07-03 05:15 PM",
//     status: "failed",
//     previousBalance: 50.0,
//     currentBalance: 50.0,
//   },
// ];

// const statuses = [
//   { value: "success", label: "Success" },
//   { value: "pending", label: "Pending" },
//   { value: "failed", label: "Failed" },
//   { value: "processing", label: "Processing" },
// ]

// export default function Page() {
//   const [data] = React.useState(() => [...transactions])
//   const [sorting, setSorting] = React.useState<SortingState>([])
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
//   const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
//   const [globalFilter, setGlobalFilter] = React.useState<string>("")
//   const [selectedDates, setSelectedDates] = React.useState<Date[] | undefined>(undefined)

//   const table = useReactTable({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//     state: { sorting, columnFilters, columnVisibility, globalFilter },
//     globalFilterFn: (row, _columnId, filterValue: string) => {
//       if (!filterValue) return true
//       const q = String(filterValue).toLowerCase().trim()
//       const { transactionId, storeId, ipAddress } = row.original as Transaction
//       return (
//         transactionId?.toLowerCase().includes(q) ||
//         storeId?.toLowerCase().includes(q) ||
//         ipAddress?.toLowerCase().includes(q)
//       )
//     },
//   })

//   React.useEffect(() => {
//     table.getColumn("dateTime")?.setFilterValue(selectedDates && selectedDates.length ? selectedDates : undefined)
//   }, [selectedDates, table])

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="font-headline">Recent Transactions</CardTitle>
//         <CardDescription>
//           A list of recent transactions.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="w-full">
//           <div className="flex items-center py-4 gap-2 flex-wrap">
//             {/* Single box for Transaction ID, Store ID, IP Address */}
//             <Input
//               placeholder="Search transactionId, storeId, or IP address..."
//               value={globalFilter ?? ""}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//               className="max-w-sm"
//             />

//             {/* Status faceted filter (unchanged) */}
//             {table.getColumn("status") && (
//               <DataTableFacetedFilter
//                 column={table.getColumn("status")}
//                 title="Status"
//                 options={statuses}
//               />
//             )}

//             {/* Pick a date (multiple) */}
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <CalendarIcon className="h-4 w-4" />
//                   Pick a date
//                   {selectedDates?.length ? (
//                     <span className="ml-2 text-xs opacity-70">
//                       {selectedDates.length} selected
//                     </span>
//                   ) : null}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="p-0" align="start">
//                 <Calendar
//                   mode="multiple"
//                   selected={selectedDates}
//                   onSelect={setSelectedDates}
//                   // optional: show outside days etc.
//                   initialFocus
//                 />
//                 <div className="flex items-center justify-end gap-2 p-2 border-t">
//                   <Button variant="ghost" size="sm" onClick={() => setSelectedDates(undefined)}>
//                     Clear
//                   </Button>
//                   <Button size="sm" onClick={() => { /* popover closes via click outside; nothing needed */ }}>
//                     Done
//                   </Button>
//                 </div>
//               </PopoverContent>
//             </Popover>

//             {/* Columns menu (unchanged) */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="ml-auto">
//                   Columns <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 {table
//                   .getAllColumns()
//                   .filter((column) => column.getCanHide())
//                   .map((column) => (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       className="capitalize"
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(value) => column.toggleVisibility(!!value)}
//                     >
//                       {column.id}
//                     </DropdownMenuCheckboxItem>
//                   ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>

//           <div className="rounded-md border overflow-hidden">
//             <Table className="">
//               <TableHeader className="bg-customViolet hover:bg-customViolet text-white">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id} className="hover:bg-transparent">
//                     {headerGroup.headers.map((header) => {
//                       return (
//                         <TableHead key={header.id} className="text-white hover:bg-transparent">
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                               header.column.columnDef.header,
//                               header.getContext()
//                             )}
//                         </TableHead>
//                       )
//                     })}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody>
//                 {table.getRowModel().rows?.length ? (
//                   table.getRowModel().rows.map((row) => (
//                     <TableRow
//                       key={row.id}
//                       data-state={row.getIsSelected() && "selected"}
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell
//                       colSpan={columns.length}
//                       className="h-24 text-center"
//                     >
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </div>
//           <div className="flex items-center justify-end space-x-2 py-4">
//             <div className="space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 Previous
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 Next
//               </Button>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>

//   )
// }

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDepositList } from "@/app/lib/api/merchant/deposite";
import DepositTable from "@/app/components/merchant/deposit/DepositTable";
import { Suspense } from "react";
import DepositTableSkeleton from "@/app/components/skeletons/DepositTableSkeleton";

export default function Page() {
  const depositListPromise = getDepositList();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>A list of recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<DepositTableSkeleton/>}>
          <DepositTable depositListPromise={depositListPromise} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
