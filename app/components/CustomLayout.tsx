"use client";

import { useEffect, useState, ReactNode } from "react";
import { SideNav } from "./Side-nav";
import { Header } from "./Header";

export type BrandInfo = {
  brand_name: string;
  whatsapp_number: string | null;
  domain_name: string | null;
  brand_logo: string;
  status: "Active" | "Inactive";
  fees_type: "Parcentage" | "Flat"; 
  fees: string; 
  is_active: boolean;
};

//type Role = "admin" | "merchant" | "staff";

type CustomLayoutProps = {
  children: ReactNode;
  balance: string;                   
  profileData: BrandInfo | null;   
};

const CustomLayout = ({ children, balance, profileData }: CustomLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  // Set initial collapsed state on the client to avoid SSR mismatch
  useEffect(() => {
    setCollapsed(window.innerWidth < 1024);
  }, []);

  const toggleSidebar = () => setCollapsed((c) => !c);

  return (
    <div className="flex bg-gray-100 min-h-screen gap-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      <SideNav collapsed={collapsed} toggleSidebar={toggleSidebar} balance={balance} />
      <div className="flex flex-col w-full transition-all duration-300 ease-in-out">
        <Header collapsed={collapsed} toggleSidebar={toggleSidebar} profileData={profileData ?? undefined} />
        <main
          className={`flex-1 p-4 md:p-6 ${collapsed ? "lg:ml-20" : "lg:ml-68"} transition-all duration-300 ease-in-out scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default CustomLayout;
