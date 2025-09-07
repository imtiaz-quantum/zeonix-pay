"use client";

import { usePathname } from "next/navigation";
import CustomLayout from "./CustomLayout";
import { ReactNode } from "react";

// Reuse this where you also type API responses
export type MerchantProfile = {
  brand_name: string;
  whatsapp_number: string | null;
  domain_name: string | null;
  brand_logo: string;
  status: "Active" | "Inactive";
  fees_type: "Parcentage" | "Flat";
  fees: string;         
  is_active: boolean;
};

type Role = "admin" | "merchant" | "staff";

type WithOutLayoutProps = {
  children: ReactNode;
  role?: Role;
  balance: string;             
  profileData?: MerchantProfile | null;  
};

export default function WithOutLayout({
  children,
  balance,
  profileData,
}: WithOutLayoutProps) {
  const pathname = usePathname(); 

  // check is dashboard 
  const isDashboardPath = /^\/(admin|merchant|staff)(\/|$)/.test(pathname);
  

  return isDashboardPath &&  !(pathname.includes("api-docs"))? (
    <CustomLayout balance={balance} profileData={profileData?? null}>
      {children}
    </CustomLayout>
  ) : (
    children
  );
}
