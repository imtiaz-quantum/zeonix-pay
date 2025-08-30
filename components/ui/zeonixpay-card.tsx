import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Globe,
/*   Lock,
  Zap,
  Code,
  Plug, */
  Server,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

export default function ZeonixPayCard() {
  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border-0">
      <CardHeader className=" text-gray-900 p-6 rounded-t-lg">
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
        {/*         <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted p-3 rounded-lg text-center transition-colors hover:bg-muted/80">
            <p className="text-xs text-muted-foreground mb-1">Environment</p>
            <p className="text-sm font-medium">Production</p>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center transition-colors hover:bg-muted/80">
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <p className="text-sm font-medium text-green-600">Live</p>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center transition-colors hover:bg-muted/80">
            <p className="text-xs text-muted-foreground mb-1">API Version</p>
            <p className="text-sm font-medium">v1.2.5</p>
          </div>
          <div className="bg-muted p-3 rounded-lg text-center transition-colors hover:bg-muted/80">
            <p className="text-xs text-muted-foreground mb-1">Requests</p>
            <p className="text-sm font-medium">12.4K/mo</p>
          </div>
        </div>
        
        <div className="flex justify-between mb-6">
          <div className="text-center">
            <Lock className="h-5 w-5 text-[#674CC4] mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
          <div className="text-center">
            <Zap className="h-5 w-5 text-[#674CC4] mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Fast</p>
          </div>
          <div className="text-center">
            <Code className="h-5 w-5 text-[#674CC4] mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">REST API</p>
          </div>
          <div className="text-center">
            <Plug className="h-5 w-5 text-[#674CC4] mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">Webhooks</p>
          </div>
        </div> */}
        <Link href="/merchant/api-docs" target="blank" passHref>
          <Button className="w-full bg-[#674CC4] hover:bg-[#5740a8] text-white cursor-pointer">
            View Full API Documentation
            <BarChart3 className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </div>
  );
}
