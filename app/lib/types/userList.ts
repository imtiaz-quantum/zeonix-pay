export type ApiUser = {
  id: number | string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  role: string;
  pid?: string;
  merchant?: {
    brand_name?: string;
    whatsapp_number?: string;
    domain_name?: string;
    brand_logo?: string;
    status?: string;
    fees_type?: string;
    deposit_fees?: string;
    payout_fees?: string;
    withdraw_fees?: string;
    is_active?: boolean;
  };
};

export type InitialPayload = {
  status: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  data: ApiUser[];
};

export type User = {
  id: string;
  pid: string;
  storeId: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  role: string;
  deposit_fees: string;
  payout_fees: string;
  withdraw_fees: string;
  brand_name?: string;
  username?: string;
};