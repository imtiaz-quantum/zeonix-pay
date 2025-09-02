"use client";

import * as React from "react";
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
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getPayoutColumns } from "@/app/components/payout/payoutColumns";
import { DataTableFacetedFilter } from "@/app/components/data-table-faceted-filter";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiResponse } from "@/app/lib/types/payout";
import { useAuth } from "@/hooks/useAuth";


const statusOptions = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "inactive", label: "Inactive" },
  { value: "success", label: "Success" },
  { value: "failed", label: "Failed" },
];

const methodOptions = [
  { value: "bkash", label: "bKash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "upay", label: "Upay" },
];



export default function PayoutTable({
  payoutListPromise,
  currentPage,
}: {
  payoutListPromise: Promise<ApiResponse>;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const payload = React.use(payoutListPromise);
  const rows = payload.data;
   const { user } = useAuth();
    const isAdmin = (user?.role ?? "").toLowerCase() === "admin";
    const columns = React.useMemo(() => getPayoutColumns(isAdmin), [isAdmin]);
console.log(rows);


  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  const table = useReactTable({
    data: rows,
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
    state: { sorting, columnFilters, columnVisibility },
  });

  // ---------- Stable page size (prevents ghost pages) ----------
  // Lock the largest page size we’ve seen; don’t shrink on last page.
  const pageSizeRef = React.useRef<number>(rows.length || 1);
  React.useEffect(() => {
    if ((rows?.length || 0) > pageSizeRef.current) {
      pageSizeRef.current = rows.length;
    }
    // If there’s only one page total (count <= current page size), make sure ref matches.
    if (payload.count <= (rows.length || 1)) {
      pageSizeRef.current = rows.length || 1;
    }
  }, [rows.length, payload.count]);

  const pageSize = Math.max(1, pageSizeRef.current);
  const totalPages = Math.max(1, Math.ceil(payload.count / pageSize));

  // If user navigated past the last page via URL, clamp back.
  React.useEffect(() => {
    if (currentPage > totalPages) {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("page", String(totalPages));
      router.replace(`?${params.toString()}`);
    }
  }, [currentPage, totalPages, router, searchParams]);

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const goToPage = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages);
    if (target === currentPage) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(target));
    router.push(`?${params.toString()}`);
  };

  // -------- Numbered page range (1 … 4 5 [6] 7 8 … N) --------
  const getPageRange = (current: number, total: number, max = 7) => {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    const end = Math.min(total, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const pages = getPageRange(currentPage, totalPages, 7);

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
          <DataTableFacetedFilter column={table.getColumn("status")} title="Status" options={statusOptions} />
        )}
        {table.getColumn("payment_method") && (
          <DataTableFacetedFilter column={table.getColumn("payment_method")} title="Method" options={methodOptions} />
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
          <TableHeader className="bg-customViolet hover:bg-customViolet text-white">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-customViolet">
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-white hover:bg-transparent py-2">
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
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
                    <TableCell  key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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
      <div className="flex items-center justify-end py-4">
        <div />
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={!canPrev}>
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

          <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={!canNext}>
            Next
          </Button>
        </div>
        <div />
      </div>
    </div>
  );
}
