"use client"
import { usePathname } from "next/navigation";
import CustomLayout from "./CustomLayout";
import { ReactNode } from "react";

export default function WithOutLayout({ children, role, balance }: { children: ReactNode, role?: 'admin' | 'merchant' | 'staff', balance: string }) {
  const pathname = usePathname();

  // Check if the pathname includes "admin", "merchant", or "staff"
  const isExcludedPage = pathname.startsWith("/admin") || pathname.startsWith("/merchant") || pathname.startsWith("/staff");

  return isExcludedPage ? 
    <CustomLayout role={role} balance={balance}>{children}</CustomLayout> :
    children;
}
