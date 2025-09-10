export type Method = "bank" | "mobileBanking" | "crypto";

export type BankMeta = {
  holderName: string;
  accountNumber: string;
  bankName: string;
  branchName?: string;
};

export type MobileBankingMeta = {
  mobileProvider?: string;
  accountType: string;
  phoneNumber: string;
};

export type CryptoMeta = {
  cryptoMethod?: string;
  cryptoId: string;
};

export type MethodType = "bkash" | "nagad" | "rocket" | "upay" | "bank" | "crypto";

export type PaymentMethod = {
  id: number;
  method_type: MethodType;
  params: {
    account_name: string;
    account_number: string;
  };
  status: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  merchant: number;
};

export interface ApiResponse {
  status: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  data: PaymentMethod[];
}