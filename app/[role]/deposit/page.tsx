import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { getDepositList } from "@/lib/api/merchant/deposite";
import { Suspense } from "react";
import DepositTableSkeleton from "@/components/skeletons/DepositTableSkeleton";
import DepositTable from "@/components/deposit/DepositTable";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    method?: string;
    pay_status?: string;
    search?: string;
    created_at_before?: string;
    created_at_after?: string; 
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

  const page = Number(sp?.page) || 1;
  const method = sp?.method || undefined;
  const pay_status = sp?.pay_status || undefined;
  const search = sp?.search || undefined;
  const created_at_before = sp?.created_at_before || undefined;
  const created_at_after = sp?.created_at_after || undefined;

  const depositListPromise = getDepositList({
    page,
    page_size: 10,
    method,
    pay_status,
    search,
    created_at_before,
    created_at_after,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Transactions</CardTitle>
        <CardDescription>A list of recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<DepositTableSkeleton />}>
          <DepositTable
            depositListPromise={depositListPromise}
            currentPage={page}
            initialFilters={{ method, pay_status, search }}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
