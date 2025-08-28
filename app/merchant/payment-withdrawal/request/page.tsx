import Link from "next/link";
import {
  Card, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Settings } from "lucide-react";
import { getPaymentMethodList } from "@/app/lib/api/merchant/payment-method";
import Submit_request from "@/app/components/merchant/withdraw-request/Submit-request";



// --------------- Constants ---------------
const MANAGE_PATH = "/merchant/payment-withdrawal/methods";

const Page = async () => {
    const res = await getPaymentMethodList()
    console.log(res);
    

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">Request Withdrawal</CardTitle>
          <CardDescription>Transfer funds from your FlowPanel account.</CardDescription>
        </div>
        <Link href={MANAGE_PATH}>
          <Button className="gap-2 bg-customViolet hover:bg-customViolet/90 cursor-pointer">
            <Settings className="h-4 w-4" />
            Manage payment methods
          </Button>
        </Link>
      </CardHeader>
      <Submit_request data={res.data}/>
    </Card>
  );
};

export default Page;
