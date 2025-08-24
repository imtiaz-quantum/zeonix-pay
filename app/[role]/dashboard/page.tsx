import { DollarSign, HandCoins, Wallet, PiggyBank } from "lucide-react";
import { StatCard } from "@/app/components/StatCard";
import RecentTransaction from "@/app/components/RecentTransaction";
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
import RecentTransactionSkeleton from "@/app/components/TrnxTableSkeleton";
import StatCards from "@/app/components/dashboard/StatCards";
import StatCardSkeleton from "@/app/components/skeletons/StatCardSkeleton";

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

let cardData = {
  total_withdraw: "50,000",
  withdraw_processing: "35,000",
  failedWithdrawals: "5,000",
  balance: "500,000",
};

export default async function page() {
  const role = await getUserRole();
  const walletTrnxPromise = getWalletTransactions();
  const statsCardsPromise = role !== "admin" ? getOverview() : null;

  return (
    <div className="grid gap-6">
      {role === "admin" && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Completed Withdrawals"
            amount={cardData?.total_withdraw}
            subtitle="Last month $24,000.00"
            change="95%"
            positive={true}
            icon={<Wallet className="w-5 h-5" />}
            bgColor="bg-cyan-100"
            iconBg="bg-cyan-500"
            iconColor="text-white"
          />

          <StatCard
            title="Pending Withdrawals"
            amount={cardData?.withdraw_processing}
            subtitle="Last month $1,600.00"
            change="95%"
            positive={true}
            icon={<HandCoins className="w-5 h-5" />}
            bgColor="bg-orange-100"
            iconBg="bg-orange-500"
            iconColor="text-white"
          />

          <StatCard
            title="Failed Withdrawals"
            amount={cardData.failedWithdrawals}
            subtitle="Last month $24,000.00"
            change="70%"
            positive={false}
            icon={<DollarSign className="w-5 h-5" />}
            bgColor="bg-purple-100"
            iconBg="bg-purple-500"
            iconColor="text-white"
          />

          <StatCard
            title="Total Balance"
            amount={cardData?.balance}
            subtitle="Last month $2,500.00"
            change="95%"
            positive={true}
            icon={<PiggyBank className="w-5 h-5" />}
            bgColor="bg-green-100"
            iconBg="bg-green-500"
            iconColor="text-white"
          />
        </div>
      )}
      <Suspense fallback={<StatCardSkeleton />}>
        <StatCards statsCardsPromise={statsCardsPromise} />
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
