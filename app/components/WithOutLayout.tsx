"use client"
import { usePathname } from "next/navigation";
import CustomLayout from "./CustomLayout";
import { ReactNode } from "react";

export default function WithOutLayout({
  children,
  role,
  balance,
}: {
  children: ReactNode;
  role?: 'admin' | 'merchant' | 'staff';
  balance: string;
}) {
  const pathname = usePathname();

  const isDashboardPath = pathname.startsWith("/admin") || pathname.startsWith("/merchant");

  return isDashboardPath
    ? <CustomLayout role={role} balance={balance}>{children}</CustomLayout>
    : children;
}
