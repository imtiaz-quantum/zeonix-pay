// app/lib/types/wallet-overview.ts
export type UserRole = "admin" | "staff" | "merchant";

export interface WalletSummary {
  balance: string;
  withdraw_processing: string;
  total_withdraw: string;
}

export interface AdminDashboardAccountantCard {
  paymenttransfer_amount: number;
  pending_paymenttransfer_amount: number;
  pending_withdrawrequest_amount: number;
  wallettransaction_fee_amount: number;
  withdrawrequest_amount: number;
}

export interface StaffDashboardAccountantCard {
  verified_invoice_amount: number;
  confirmed_payout_amount: number;
}

export interface MerchantDashboardAccountantCard {
  invoice_amount: number;
  pending_invoice_amount: number;
  withdrawrequest_amount: number;
  payout_amount: number;
}

type DashboardCardMap = {
  admin: AdminDashboardAccountantCard;
  staff: StaffDashboardAccountantCard;
  merchant: MerchantDashboardAccountantCard;
};

export type WalletOverviewResponse<R extends UserRole> = {
  status: boolean;
  wallet: WalletSummary;
  dashboard_accountant_card: DashboardCardMap[R];
};

export type WalletOverviewAny =
  | WalletOverviewResponse<"admin">
  | WalletOverviewResponse<"staff">
  | WalletOverviewResponse<"merchant">;
