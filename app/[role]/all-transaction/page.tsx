import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { getDepositList } from "@/app/lib/api/merchant/deposite";
import DepositTable from "@/app/components/merchant/deposit/DepositTable";
import { Suspense } from "react";
import DepositTableSkeleton from "@/app/components/skeletons/DepositTableSkeleton";
import { getPayoutList } from "@/app/lib/api/merchant/payout";
import PayoutTable from "@/app/components/PayoutTable";
import { getOverview } from "@/app/lib/api/merchant/overview";
import LedgerTable from "@/app/components/ledger/LedgerTable";
import { getWalletTransactions } from "@/app/lib/api/merchant/wallet";

type PageProps = {
  searchParams: Promise<{ page?: string }>; 
};

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;           
  const page = Number(sp?.page) || 1;          
  const ledgerListPromise = getWalletTransactions(page); 

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">All Transactions</CardTitle>
        <CardDescription>All balance changes with fees & net amounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<DepositTableSkeleton />}>
            <LedgerTable ledgerListPromise={ledgerListPromise} currentPage={page} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
