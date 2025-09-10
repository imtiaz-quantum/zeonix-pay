"use client";

import { use, useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getDepositColumns } from "./depositColumns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { DepositListResponse } from "@/lib/types/deposit";
import PayoutTotalsBar from "../payout/PayoutTotalsBar";

const payStatusOptions = [
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "failed", label: "Failed" },
];

const methodOptions = [
  { value: "bkash", label: "bkash" },
  { value: "nagad", label: "Nagad" },
  { value: "rocket", label: "Rocket" },
  { value: "upay", label: "Upay" },
];


type Filters = {
  method?: string;
  pay_status?: string;
  search?: string;
  created_at_before?: string; // YYYY-MM-DD
  created_at_after?: string;  // YYYY-MM-DD
};


export default function DepositTable({
  depositListPromise,
  currentPage,
  initialFilters,
}: {
  depositListPromise: Promise<DepositListResponse>;
  currentPage: number;
  initialFilters: Filters;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ALL = "__all__";

  // Resolve server data (Suspense handles loading)
  const payload = use(depositListPromise);
  const rows = payload.data;
  console.log(rows)
  const { user } = useAuth();
  const isAdmin = (user?.role ?? "").toLowerCase() === "admin";
  const columns = useMemo(() => getDepositColumns(isAdmin), [isAdmin]);

  // Only keep sorting/visibility (no client filtering)
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: rows,
    columns,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, columnVisibility },
  });

  // Derive page size from server results (inferred)
  const pageSizeRef = useRef<number>(rows.length || 1);
  useEffect(() => {
    if (payload.next) {
      pageSizeRef.current = Math.max(pageSizeRef.current, rows.length || 1);
    }
    if (!payload.next && !payload.previous) {
      pageSizeRef.current = rows.length || 1;
    }
  }, [payload.next, payload.previous, rows.length]);

  const pageSize = pageSizeRef.current || 1;
  const totalPages = Math.max(1, Math.ceil(payload.count / pageSize));

  // If someone navigates past totalPages via URL, clamp to last page
  useEffect(() => {
    if (currentPage > totalPages) {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("page", String(totalPages));
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [currentPage, totalPages, router, searchParams]);

  const canPrev = currentPage > 1 && Boolean(payload.previous);
  const canNext = currentPage < totalPages && Boolean(payload.next);

  const goToPage = (page: number) => {
    const target = Math.min(Math.max(1, page), totalPages);
    if (target === currentPage) return;
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("page", String(target));
    router.push(`?${params.toString()}`);
  };

  // build compact page range
  const getPageRange = (current: number, total: number, max = 7) => {
    if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    const end = Math.min(total, start + max - 1);
    if (end - start + 1 < max) start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };
  const pages = getPageRange(currentPage, totalPages, 7);

  // --- URL-driven filters (server-side) ---
  // debounce for text input
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const replaceDebounced = useCallback((url: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      router.replace(url, { scroll: false });
    }, 350);
  }, [router]);

  const setParam = useCallback((key: string, value?: string, debounced = false) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value && value.trim() !== "") params.set(key, value);
    else params.delete(key);
    // reset page when filters change
    params.delete("page");
    const url = `?${params.toString()}`;
    if (debounced) replaceDebounced(url);
    else router.replace(url, { scroll: false });
  }, [router, searchParams, replaceDebounced]);


  {/* Multi range calender picker */ }
  const toYMD = (d: Date) => format(d, "yyyy-MM-dd");

  const [range, setRange] = useState<DateRange | undefined>(() => {
    const fromStr = initialFilters.created_at_after;
    const toStr = initialFilters.created_at_before;
    const from = fromStr ? new Date(fromStr) : undefined;
    const to = toStr ? new Date(toStr) : undefined;
    return from || to ? { from, to } : undefined;
  });

  const applyRange = (r?: DateRange) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (r?.from) params.set("created_at_after", toYMD(r.from)); else params.delete("created_at_after");
    if (r?.to) params.set("created_at_before", toYMD(r.to)); else params.delete("created_at_before");
    params.delete("page"); // reset paging on filter change
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const label =
    range?.from
      ? range.to
        ? `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
        : `${format(range.from, "MMM d, yyyy")} …`
      : "Date range";


  return (
    <div className="w-full overflow-hidden">
      {/* FILTERS (server-side) */}
      <div className="flex  items-center py-4 gap-2 overflow-x-auto">
        {/* search */}
        <Input
          placeholder="Filter by search…"
          defaultValue={initialFilters.search ?? ""}
          onChange={(e) => setParam("search", e.target.value, true)}
          className="md:max-w-sm min-w-[250px] flex-1"
        />

        {/* pay_status */}
        <Select
          value={searchParams.get("pay_status") ?? initialFilters.pay_status ?? undefined}
          onValueChange={(v) => setParam("pay_status", v === ALL ? undefined : v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Pay Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>   {/* ← no empty string */}
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* method */}
        <Select
          value={searchParams.get("method") ?? initialFilters.method ?? undefined}
          onValueChange={(v) => setParam("method", v === ALL ? undefined : v)}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All</SelectItem>   {/* ← no empty string */}
            <SelectItem value="bkash">bKash</SelectItem>
            <SelectItem value="nagad">Nagad</SelectItem>
            <SelectItem value="rocket">Rocket</SelectItem>
            <SelectItem value="upay">Upay</SelectItem>
          </SelectContent>
        </Select>
        {/* Multi range calender picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-56 justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span className="truncate">{label}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="range"
              numberOfMonths={1}
              selected={range}
              onSelect={(r) => {
                setRange(r);
                // apply automatically when both ends chosen
                if (r?.from && r?.to) applyRange(r);
              }}
            />
            <div className="flex items-center justify-between gap-2 p-2 border-t">
              <Button
                variant="ghost"
                onClick={() => {
                  setRange(undefined);
                  applyRange(undefined);
                }}
                className="cursor-pointer"
              >
                Clear
              </Button>
              <Button
                onClick={() => applyRange(range)}
                className="bg-customViolet hover:bg-customViolet/90 cursor-pointer"
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Columns menu (unchanged) */}
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

      {/* TABLE */}
      <div className="rounded-md border overflow-hidden overflow-x-auto">
        <Table>
          <TableHeader className="bg-customViolet hover:bg-customViolet">
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

      <PayoutTotalsBar totals={payload.total_amount} />

      {/* PAGINATION */}
      <div className="flex items-center justify-end py-4">
        <div />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={!canPrev}
          >
            Previous
          </Button>

          {/* leading … */}
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

          {/* trailing … */}
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
        <div />
      </div>
    </div>
  );
}
