import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import DepositTableSkeleton from "@/components/skeletons/DepositTableSkeleton";
import LedgerTable from "@/components/ledger/LedgerTable";
import { getWalletTransactions } from "@/app/lib/api/merchant/wallet";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    method?: string;
    status?: string;
    tran_type?: string;
    search?: string;
    created_at_before?: string;
    created_at_after?: string; 
  }>;
};
export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

  const page = Number(sp?.page) || 1;
  const method = sp?.method || undefined;
  const status = sp?.status || undefined;
  const tran_type = sp?.tran_type || undefined;
  const search = sp?.search || undefined;
  const created_at_before = sp?.created_at_before || undefined;
  const created_at_after = sp?.created_at_after || undefined;

  const ledgerListPromise = getWalletTransactions({
    page,
    page_size: 10,
    method,
    status,
    tran_type,
    search,
    created_at_before,
    created_at_after,
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">All Transactions</CardTitle>
        <CardDescription>All balance changes with fees & net amounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<DepositTableSkeleton />}>
            <LedgerTable ledgerListPromise={ledgerListPromise}  initialFilters={{ method, status, search, tran_type }} currentPage={page} />
        </Suspense>
      </CardContent>
    </Card>
  );
}
