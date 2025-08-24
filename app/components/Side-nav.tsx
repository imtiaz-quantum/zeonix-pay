"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Send,
  Landmark,
  Settings,
  ChevronRight,
  LogOut,
  Users,
  UserCog,
} from "lucide-react";
import { Wallet, Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import React, { useEffect, useMemo, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import Image from "next/image";

/* const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/user-list", icon: Users, label: "User List" },
  { href: "/staff-list", icon: UserCog, label: "Staff List" },
  { href: "/deposit", icon: ArrowRightLeft, label: "Deposit" },
  { href: "/payout", icon: Send, label: "Payout" },
  {
    href: "/payment-withdrawal",
    icon: Landmark,
    label: "Payment Withdrawal",
    subItems: [
      { href: "/payment-withdrawal/request", label: "Request Withdrawal" },
      { href: "/payment-withdrawal/report", label: "Withdrawal Report" },
      { href: "/payment-withdrawal/methods", label: "Payment Methods" },
    ],
  },
  // {
  //   href: "/payment-link",
  //   icon: Landmark,
  //   label: "Payment Link",
  //   subItems: [
  //     { href: "/payment-link/create", label: "Create Payment Link" },
  //     { href: "/payment-link/list", label: "All List" },
  //   ],
  // },
  { href: "/settings", icon: Settings, label: "Settings" },
]; */

type SideNavProps = {
  collapsed: boolean;
  toggleSidebar: () => void;
  role?: 'admin' | 'merchant' | 'staff';
  balance: string
};



export function SideNav({ role, collapsed, toggleSidebar, balance }: SideNavProps) {
  const pathname = usePathname();
  const [activeSubItem, setActiveSubItem] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  // Balance state

  const [showBalance, setShowBalance] = useState(true);

  // Track which popover is open (when collapsed)
  const [openId, setOpenId] = useState<string | null>(null);


  // Filter items based on user role
  const navItems = useMemo(() => {
    if (role === "admin") {
      return [
        { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/admin/user-list", icon: Users, label: "User List" },
        { href: "/admin/staff-list", icon: UserCog, label: "Staff List" },
        { href: "/admin/deposit", icon: ArrowRightLeft, label: "Deposit" },
        { href: "/admin/payout", icon: Send, label: "Payout" },
        { href: "/admin/payment-withdrawal",icon: Landmark, label: "Payment Withdrawal"},
        { href: "/admin/settings", icon: Settings, label: "Settings" },
      ];
    } else if (role === "staff") {
      return [
        { href: "/staff/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/staff/deposit", icon: ArrowRightLeft, label: "Deposit" },
        {
          href: "/staff/payment-withdrawal",
          icon: Landmark,
          label: "Payment Withdrawal",
          subItems: [
            { href: "/staff/payment-withdrawal/request", label: "Request Withdrawal" },
            { href: "/staff/payment-withdrawal/report", label: "Withdrawal Report" },
            { href: "/staff/payment-withdrawal/methods", label: "Payment Methods" },
          ],
        },
        { href: "/staff/settings", icon: Settings, label: "Settings" },
      ];
    } else if (role === "merchant") {
      return [
        { href: "/merchant/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/merchant/deposit", icon: ArrowRightLeft, label: "Deposit" },
        { href: "/merchant/payout", icon: Send, label: "Payout" },
        {
          href: "/merchant/payment-withdrawal",
          icon: Landmark,
          label: "Payment Withdrawal",
          subItems: [
            { href: "/merchant/payment-withdrawal/request", label: "Request Withdrawal" },
            { href: "/merchant/payment-withdrawal/report", label: "Withdrawal Report" },
            { href: "/merchant/payment-withdrawal/methods", label: "Payment Methods" },
          ],
        },
        { href: "/merchant/settings", icon: Settings, label: "Settings" },
      ];
    }
    return []; // In case no role is found
  }, [role]);


  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleHashChange = () => setActiveSubItem(window.location.hash);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);

    handleHashChange();
    checkMobile();

    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("resize", checkMobile);
    };
  }, [pathname]);

  // Close any open popover when route changes
  useEffect(() => {
    setOpenId(null);
  }, [pathname]);

  const formattedBalance = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "BDT",
        maximumFractionDigits: 0,
      }).format(Number(balance)),
    [balance]
  );

  // Filter items based on admin status
  const itemsToRender = useMemo(() => {
    if (role === "admin") return navItems;
    const hide = new Set(["/user-list", "/staff-list"]);
    return navItems.filter((i) => !hide.has(i.href));
  }, [role]);

  return (
    <>
      {/* Overlay for mobile off-canvas */}
      {!collapsed && isMobile && (
        <div
          onClick={toggleSidebar}
          className="w-full h-screen inset-0 z-40 bg-black opacity-70 fixed lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed h-screen z-50 px-2 bg-white shadow-md transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-72 sm:w-80 lg:w-68"}
        ${isMobile ? (collapsed ? "-translate-x-full" : "translate-x-0") : ""}`}
      >
        <div className="flex flex-col gap-2 h-full">
          {/* Logo/Header */}
          <div
            className={`flex items-center px-4 py-4 ${collapsed ? "justify-center" : "justify-start gap-2"
              }`}
          >
            <div className={`p-1 rounded-sm text-blue-600 text-3xl ${collapsed ? "" : "hidden"}`}>
              <Image src="/Zeonix-icon.png" width={32} height={32} alt="zeonix-logo" />
            </div>
            <div className={`flex items-center ${collapsed ? "hidden" : "flex"}`}>
              <Image src="/zeonix-logo.png" width={32} height={32} alt="zeonix-logo" />
            </div>
            {!collapsed && (
              <div className="flex flex-col leading-tight">
                <img src="/zeonix-logo.png" alt="zeonix-logo" />
                <p className="text-[10px] text-gray-500 text-right">Payment Management System</p>
              </div>
            )}
          </div>
          <TooltipProvider>
            {collapsed ? (
              // Collapsed: show a round icon that reveals balance on hover
              <div className="px-2 mb-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-gray-100 border flex items-center justify-center shadow-sm"
                      aria-label="Show balance"
                    >
                      <Wallet className="h-5 w-5 text-gray-700" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-sm">
                    <div className="text-gray-500">Balance</div>
                    <div className="font-semibold text-white">{formattedBalance}</div>
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              // Expanded: show a compact card with eye-toggle
              <div className="mx-3 mb-3 rounded-xl border bg-white shadow-sm px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-lg bg-gray-100 w-8 h-8">
                    <Wallet className="h-4 w-4 text-gray-700" />
                  </span>
                  <div className="leading-tight">
                    <div className="text-xs text-gray-500">Balance</div>
                    <div className="font-semibold text-gray-900">
                      {showBalance ? formattedBalance : "•••••••"}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowBalance((s) => !s)}
                  className="p-2 rounded-md hover:bg-gray-50 text-gray-600"
                  aria-label={showBalance ? "Hide balance" : "Show balance"}
                >
                  {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
          </TooltipProvider>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="space-y-1 px-2">
              {itemsToRender.map((item) => {
                const hasSubs = !!item.subItems;
                const isActiveSection = pathname.startsWith(item.href);

                // COLLAPSED + DESKTOP: Popover on click
                if (collapsed && !isMobile && hasSubs) {
                  const id = item.href;
                  const open = openId === id;

                  return (
                    <li key={item.href} className="relative">
                      <Popover.Root open={open} onOpenChange={(o) => setOpenId(o ? id : null)}>
                        <Popover.Trigger asChild>
                          <button
                            className={`w-full flex items-center p-3 rounded-md font-medium transition-colors justify-center
                              ${isActiveSection
                                ? "text-white bg-customViolet hover:text-slate-200"
                                : "text-gray-700 hover:text-customViolet"
                              }`}
                            aria-haspopup="menu"
                            aria-expanded={open}
                          >
                            <item.icon size={18} />
                          </button>
                        </Popover.Trigger>

                        <Popover.Content
                          side="right"
                          align="start"
                          sideOffset={12}
                          className="z-50 w-60 rounded-md border bg-white shadow-lg outline-none"
                        >
                          <div className="px-3 py-2 text-sm font-medium text-gray-700 border-b">
                            {item.label}
                          </div>
                          <ul className="p-2 space-y-1">
                            {item.subItems!.map((sub) => {
                              const active =
                                pathname + activeSubItem === sub.href || pathname === sub.href;
                              return (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className={`block px-3 py-2 text-sm rounded-md transition-colors
                                      ${active
                                        ? "bg-customViolet text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-customViolet"
                                      }`}
                                    onClick={() => setOpenId(null)}
                                    role="menuitem"
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                          <Popover.Arrow className="fill-white drop-shadow" />
                        </Popover.Content>
                      </Popover.Root>
                    </li>
                  );
                }

                // EXPANDED or MOBILE (sidebar visible): Collapsible
                return (
                  <li key={item.href}>
                    {hasSubs ? (
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <button
                            className={`w-full flex items-center p-3 rounded-md hover:text-customViolet font-medium transition-colors
                              ${isActiveSection
                                ? "text-white bg-customViolet hover:text-slate-200"
                                : "text-gray-700"
                              }
                              ${collapsed ? "justify-center" : "justify-between"}`}
                          >
                            <div className="flex items-center gap-3">
                              <item.icon size={18} />
                              {!collapsed && <span>{item.label}</span>}
                            </div>
                            {!collapsed && (
                              <ChevronRight
                                size={16}
                                className="transition-transform group-data-[state=open]:rotate-90"
                              />
                            )}
                          </button>
                        </CollapsibleTrigger>

                        {!collapsed && (
                          <CollapsibleContent>
                            <ul className="ml-2 pl-7 border-l-2 border-gray-100 space-y-1">
                              {item.subItems!.map((subItem) => {
                                const active =
                                  pathname + activeSubItem === subItem.href ||
                                  pathname === subItem.href;
                                return (
                                  <li key={subItem.href}>
                                    <Link
                                      href={subItem.href}
                                      className={`block p-2 text-sm rounded-md transition-colors
                                        ${active
                                          ? "text-customViolet font-medium"
                                          : "text-gray-600 hover:bg-gray-100 hover:text-customViolet"
                                        }`}
                                    >
                                      {subItem.label}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </CollapsibleContent>
                        )}
                      </Collapsible>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center p-3 rounded-md transition-colors
                          ${pathname === item.href
                            ? "bg-customViolet hover:text-slate-200 text-white font-medium"
                            : "text-gray-700 hover:text-customViolet font-medium"
                          }
                          ${collapsed ? "justify-center" : "gap-3"}`}
                      >
                        <item.icon size={18} />
                        {!collapsed && <span>{item.label}</span>}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer/Logout */}
          <div className={`p-4 ${collapsed ? "text-center" : ""}`}>
            <button
              onClick={() => console.log("Logout")}
              className={`flex items-center text-gray-700 hover:text-primary transition-colors ${collapsed ? "justify-center mx-auto" : "gap-3"
                }`}
            >
              <LogOut size={18} />
              {!collapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
