"use client"

import * as React from "react"
import {
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { columns, type Transaction } from "@/app/components/merchant/withdraw-request/reportColumns"
import { DataTableFacetedFilter } from "@/app/components/data-table-faceted-filter"

const statuses = [
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
  { value: "processing", label: "Processing" },
  { value: "rejected", label: "Rejected" },
]

export default function Report({ dataa }: { dataa: Transaction[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

  const table = useReactTable({
    data: dataa,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    // (optional) set a default page size
    // initialState: { pagination: { pageSize: 10 } },
  })

  // ---- Numbered pagination helpers (client-side) ----
  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex + 1
  const canPrev = table.getCanPreviousPage()
  const canNext = table.getCanNextPage()

  const getPageRange = (current: number, total: number, max = 7) => {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1)
    const half = Math.floor(max / 2)
    let start = Math.max(1, current - half)
    let end = Math.min(total, start + max - 1)
    if (end - start + 1 < max) start = Math.max(1, end - max + 1)
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }
  const pages = getPageRange(currentPage, pageCount, 7)

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filter by trx_id…"
          value={(table.getColumn("trx_id")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("trx_id")?.setFilterValue(e.target.value)}
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
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-customViolet hover:bg-customViolet">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-customViolet">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white hover:bg-transparent py-2">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Numbered Pagination */}
      <div className="flex items-center justify-between py-4">
        <div />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!canPrev}
          >
            Previous
          </Button>

          {pages[0] !== 1 && (
            <>
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(0)}>
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
              onClick={() => table.setPageIndex(p - 1)}
              className={p === currentPage ? "bg-customViolet text-white hover:bg-customViolet/90" : ""}
            >
              {p}
            </Button>
          ))}

          {pages[pages.length - 1] !== pageCount && (
            <>
              {pages[pages.length - 1] < pageCount - 1 && <span className="px-1">…</span>}
              <Button variant="outline" size="sm" onClick={() => table.setPageIndex(pageCount - 1)}>
                {pageCount}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!canNext}
          >
            Next
          </Button>
        </div>
        <div />
      </div>
    </div>
  )
}
