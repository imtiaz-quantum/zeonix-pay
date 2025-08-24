import React, { use } from "react";
import { StatCard } from "../StatCard";
import { DollarSign, HandCoins, PiggyBank, Wallet } from "lucide-react";

interface StatsData {
  total_withdraw: string;
  withdraw_processing: string;
  failedWithdrawals: string;
  balance: string;
}

interface ApiResponse {
  status: boolean;
  count: number;
  data: StatsData;
}

type DynamicTableProps = {
  statsCardsPromise: Promise<ApiResponse> | null;
};

const StatCards: React.FC<DynamicTableProps> = ({ statsCardsPromise }) => {
  const data = statsCardsPromise ? use(statsCardsPromise).data : null;

  if (!data) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Completed Withdrawals"
        amount={data.total_withdraw}
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
        amount={data.withdraw_processing}
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
        amount={data.failedWithdrawals?? "0.00"}
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
        amount={data.balance}
        subtitle="Last month $2,500.00"
        change="95%"
        positive={true}
        icon={<PiggyBank className="w-5 h-5" />}
        bgColor="bg-green-100"
        iconBg="bg-green-500"
        iconColor="text-white"
      />
    </div>
  );
};

export default StatCards;