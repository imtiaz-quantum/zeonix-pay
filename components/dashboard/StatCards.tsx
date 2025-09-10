"use client";

import React, { use } from "react";
import { DollarSign, HandCoins, PiggyBank, Wallet } from "lucide-react";
import { StatCard } from "../StatCard";
import type {
  AdminDashboardAccountantCard,
  StaffDashboardAccountantCard,
  MerchantDashboardAccountantCard,
  WalletOverviewAny,
  UserRole,
} from "@/lib/types/wallet-overview";

export type Props = {
  role: UserRole;
  statsCardsPromise: Promise<WalletOverviewAny>;
};

// ----- type guards -----
function isMerchantCard(
  c: AdminDashboardAccountantCard | StaffDashboardAccountantCard | MerchantDashboardAccountantCard
): c is MerchantDashboardAccountantCard {
  return "invoice_amount" in c && "payout_amount" in c;
}

function isAdminCard(
  c: AdminDashboardAccountantCard | StaffDashboardAccountantCard | MerchantDashboardAccountantCard
): c is AdminDashboardAccountantCard {
  return (
    "paymenttransfer_amount" in c &&
    "wallettransaction_fee_amount" in c
  );
}

function isStaffCard(
  c: AdminDashboardAccountantCard | StaffDashboardAccountantCard | MerchantDashboardAccountantCard
): c is StaffDashboardAccountantCard {
  return "verified_invoice_amount" in c;
}

const fmt = (n: number | undefined) => (typeof n === "number" ? n : 0);

const StatCards: React.FC<Props> = ({ statsCardsPromise }) => {
  const payload = use(statsCardsPromise);
  const card = payload.dashboard_accountant_card;
  console.log(card);

  if (!card) return null;
//...........Merchant
  if (isMerchantCard(card)) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="All Deposit"
          amount={fmt(card.invoice_amount)}
          subtitle="Last month $24,000.00"
          change="95%"
          positive
          icon={<Wallet className="w-5 h-5" />}
          bgColor="bg-cyan-100"
          iconBg="bg-cyan-500"
          iconColor="text-white"
        />
        <StatCard
          title="Pending Deposit"
          amount={fmt(card.pending_invoice_amount)}
          subtitle="Last month $1,600.00"
          change="95%"
          positive
          icon={<HandCoins className="w-5 h-5" />}
          bgColor="bg-orange-100"
          iconBg="bg-orange-500"
          iconColor="text-white"
        />
        <StatCard
          title="All Payouts"
          amount={fmt(card.withdrawrequest_amount)}
          subtitle="Last month $24,000.00"
          change="70%"
          positive={false}
          icon={<DollarSign className="w-5 h-5" />}
          bgColor="bg-purple-100"
          iconBg="bg-purple-500"
          iconColor="text-white"
        />
        <StatCard
          title="Pending Payouts"
          amount={fmt(card.payout_amount)}
          subtitle="Last month $2,500.00"
          change="95%"
          positive
          icon={<PiggyBank className="w-5 h-5" />}
          bgColor="bg-green-100"
          iconBg="bg-green-500"
          iconColor="text-white"
        />
      </div>
    );
  }
//.........Admin
  if (isAdminCard(card)) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="All Transfers"
          amount={fmt(card.paymenttransfer_amount)}
          subtitle="Last month"
          change="88%"
          positive
          icon={<Wallet className="w-5 h-5" />}
          bgColor="bg-cyan-100"
          iconBg="bg-cyan-500"
          iconColor="text-white"
        />
        <StatCard
          title="Pending Transfers"
          amount={fmt(card.pending_paymenttransfer_amount)}
          subtitle="Last month"
          change="64%"
          positive
          icon={<HandCoins className="w-5 h-5" />}
          bgColor="bg-orange-100"
          iconBg="bg-orange-500"
          iconColor="text-white"
        />
        <StatCard
          title="Withdraw Request"
          amount={fmt(card.withdrawrequest_amount)}
          subtitle="Last month"
          change="12%"
          positive
          icon={<HandCoins className="w-5 h-5" />}
          bgColor="bg-green-100"
          iconBg="bg-green-500"
          iconColor="text-white"
        />
        <StatCard
          title="Pending Withdraw"
          amount={fmt(card.pending_withdrawrequest_amount)}
          subtitle="Last month"
          change="32%"
          positive={false}
          icon={<DollarSign className="w-5 h-5" />}
          bgColor="bg-purple-100"
          iconBg="bg-purple-500"
          iconColor="text-white"
        />
        <StatCard
          title="Fee Collected"
          amount={fmt(card.wallettransaction_fee_amount)}
          subtitle="Last month"
          change="12%"
          positive
          icon={<PiggyBank className="w-5 h-5" />}
          bgColor="bg-green-100"
          iconBg="bg-green-500"
          iconColor="text-white"
        />
      </div>
    );
  }

  //........staff
  if (isStaffCard(card)) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Verified Invoices"
          amount={fmt(card.verified_invoice_amount)}
          subtitle="Last month"
          change="90%"
          positive
          icon={<Wallet className="w-5 h-5" />}
          bgColor="bg-cyan-100"
          iconBg="bg-cyan-500"
          iconColor="text-white"
        />
        <StatCard
          title="Confirmed Payout"
          amount={fmt(card.confirmed_payout_amount)}
          subtitle="Last month"
          change="90%"
          positive
          icon={<PiggyBank className="w-5 h-5" />}
          bgColor="bg-green-100"
          iconBg="bg-green-500"
          iconColor="text-white"
        />
      </div>
    );
  }

  // Fallback (shouldn't happen)
  return null;
};

export default StatCards;
