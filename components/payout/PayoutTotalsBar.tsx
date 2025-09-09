"use client";

import { useAuth } from "@/hooks/useAuth";
import * as React from "react";

type TotalAmount = {
  total_amount: number | string;
  pending_amount: number | string;
  success_amount: number | string;
  rejected_amount: number | string;
  delete_amount: number | string;
};

export default function TotalAmountBar({ totals }: { totals: TotalAmount }) {
  const fmt = (v: number | string) =>
    typeof v === "number" ? v.toLocaleString() : v;
  const { user } = useAuth();
  const isAdmin = (user?.role ?? "").toLowerCase() === "admin";

  return (
    <div className="my-3 rounded-md border bg-white">
      <div className={`grid ${isAdmin ? "grid-cols-5" : "grid-cols-4"}`}>
        <Item label="Total" value={fmt(totals.total_amount)} className="bg-purple-100" />
        <Item label="Pending" value={fmt(totals.pending_amount)} className="bg-orange-100" />
        <Item label="Success" value={fmt(totals.success_amount)} className="bg-green-100" />
        <Item label="Rejected" value={fmt(totals.rejected_amount)} className="bg-red-100" />
        {isAdmin &&
          <Item label="Deleted" value={fmt(totals.delete_amount)} className="bg-indigo-100" />}
      </div>
    </div>
  );
}

function Item({
  label,
  value,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-3 flex flex-col items-center border-b sm:border-b-0 sm:border-r last:sm:border-r-0 ${className}`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}





