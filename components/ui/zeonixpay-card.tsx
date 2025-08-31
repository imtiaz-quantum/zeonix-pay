"use client";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, Server, BarChart3 } from "lucide-react";

interface Props {
  userRole?: "Admin" | "Merchant" | "Staff";
}

export default function ZeonixPayCard({ userRole }: Props) {
  const handleClick = () => {
    if (!userRole) {
      alert("Role not found. Cannot open API documentation.");
      return;
    }
    const url = `/${userRole.toLowerCase()}/api-docs`;
    window.open(url, "_blank"); // open in new tab
  };

  return (
    <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
      <CardHeader className="text-gray-900 p-6 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Server className="h-6 w-6 text-[#674CC4]" />
          </div>
          <CardTitle className="text-2xl font-bold">
            ZeonixPay — Payment Gateway API
          </CardTitle>
        </div>
        <div className="flex items-center mt-4 space-x-2 text-gray-800">
          <Calendar className="h-4 w-4" />
          <p className="text-sm">Last updated: 2025-08-27 11:16</p>
        </div>
        <div className="flex items-center mt-1 space-x-2 text-gray-800">
          <Globe className="h-4 w-4" />
          <p className="text-sm">Timezone: Asia/Dhaka</p>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Button
          onClick={handleClick}
          className="w-full bg-[#674CC4] hover:bg-[#5740a8] text-white cursor-pointer"
        >
          View Full API Documentation
          <BarChart3 className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </div>
  );
}
