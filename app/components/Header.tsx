"use client";

import {
  Search,
  Bell,
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";

// Keep this in a shared types file if possible
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

type Role = "admin" | "merchant" | "staff";

type HeaderProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
  profileData?: BrandInfo | null;
};

export function Header({ collapsed, toggleSidebar, profileData }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [imgLoaded, setImgLoaded] = useState(false);

  const { role } = useAuth();
  const safeRole: Role = role ?? ""; 

  // Page title from path segment
  const last = pathname.split("/").filter(Boolean).pop() ?? "dashboard";
  const pageTitle = decodeURIComponent(last).replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase());

  const handleLogout = () => {
    const redirectMap: Record<Role, string> = {
      admin: "/login/admin",
      merchant: "/login/merchant",
      staff: "/login/staff",
    };
    const fallback = "/login";
    signOut({ callbackUrl: redirectMap[safeRole] || fallback });
  };

  const handleClick = () => {
    router.push(`/${safeRole}/profile`);
  };

  const handleClickSetting = () => {
    router.push(`/${safeRole}/settings`);
  };

  const avatarSrc = profileData?.brand_logo || "https://placehold.co/40x40.png";
  const avatarFallback = (profileData?.brand_name?.[0] ?? "U").toUpperCase();

  return (
    <header
      className={`flex h-14 items-center justify-between gap-4 border-b bg-card px-4 lg:h-[70px] lg:px-6 sticky top-0 z-30 ${collapsed ? "lg:ml-20" : "lg:ml-64"
        } transition-all duration-300 ease-in-out`}
    >
      <div className="flex gap-2 items-center">
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="ml-auto text-gray-500 hover:text-primary"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <h1 className="text-lg font-semibold md:text-2xl capitalize font-headline">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8 relative">
                {!imgLoaded && (
                  <Skeleton className="absolute inset-0 h-8 w-8 rounded-full" />
                )}
                <AvatarImage
                  src={avatarSrc}
                  alt={profileData?.brand_name ?? "User"}
                  onLoadingStatusChange={(status) => setImgLoaded(status === "loaded")}
                  className={`h-8 w-8 transition-opacity duration-200 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profileData?.brand_name ?? "User"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {safeRole !== "admin" && (
                <DropdownMenuItem onClick={handleClickSetting}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
