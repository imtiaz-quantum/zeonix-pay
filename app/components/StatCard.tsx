"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type StatCardProps = {
  title: string;
  amount: string;
  subtitle: string;
  icon: ReactNode;
  bgColor: string; // Tailwind bg color class (e.g., "bg-blue-100")
  iconBg: string;  // Icon circle bg color (e.g., "bg-blue-500")
  iconColor: string; // Icon/text color (e.g., "text-white")
  change: string;
  positive: boolean;
};

export const StatCard = ({
  title,
  amount,
  subtitle,
  icon,
  bgColor,
  iconBg,
  iconColor,
  change,
  positive,
}: StatCardProps) => {
  return (
    <Card className={`w-full rounded-xl ${bgColor} border-none shadow-sm`}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <h1 className="text-sm font-medium text-gray-800">{title}</h1>
        <span className={`p-2 rounded-full ${iconBg} ${iconColor}`}>
          {icon}
        </span>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">BDT{amount}</div>
        <div className="flex items-center text-xs text-gray-700 gap-2">
          <div
            className={`flex items-center px-2 py-0.5 rounded-full text-white text-[10px] font-medium ${
              positive ? "bg-green-500/60" : "bg-red-500/60"
            }`}
          >
            {positive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {change}
          </div>
          <span>{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );
};
