import RecentTransaction from "@/components/dashboard/RecentTransaction";
import { getWalletTransactions } from "@/app/lib/api/merchant/wallet";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getOverview } from "@/app/lib/api/merchant/overview";
import { getUserRole } from "@/app/lib/auth";
import { Suspense } from "react";
import RecentTransactionSkeleton from "@/components/skeletons/TrnxTableSkeleton";
import StatCards from "@/components/dashboard/StatCards";
import StatCardSkeleton from "@/components/skeletons/StatCardSkeleton";
import { UserRole, WalletOverviewAny } from "@/app/lib/types/wallet-overview";

const tableHeaders = [
  "ID",
  "Store Name",
  "Transaction ID",
  "Payment Method",
  "Type",
  "Date & Time",
  "Status",
  "Amount",
];


export default async function page() {
  const role = (await getUserRole()) as UserRole;
  const statsCardsPromise = getOverview(role) as Promise<WalletOverviewAny>;
  const walletTrnxPromise = getWalletTransactions({page:1, page_size:10});

  return (
    <div className="grid gap-6">
      <Suspense fallback={<StatCardSkeleton />}>
        <StatCards role={role} statsCardsPromise={statsCardsPromise} />
      </Suspense>
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle className="font-headline">Recent Transactions</CardTitle>
          <CardDescription>
            A list of recent transactions from your store.
          </CardDescription>
        </CardHeader>
        <Suspense
          fallback={<RecentTransactionSkeleton headers={tableHeaders} />}
        >
          <RecentTransaction
            headers={tableHeaders}
            walletTrnxPromise={walletTrnxPromise}
          />
        </Suspense>
      </Card>
    </div>
  );
}
