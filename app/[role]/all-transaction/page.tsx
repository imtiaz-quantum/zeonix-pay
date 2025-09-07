import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import DepositTableSkeleton from "@/components/skeletons/DepositTableSkeleton";
import LedgerTable from "@/components/ledger/LedgerTable";
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
