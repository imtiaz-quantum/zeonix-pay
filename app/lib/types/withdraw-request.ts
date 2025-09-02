export type Transaction = {
  id: number,
  merchant: number
  paymentDetails: { account_name: string; account_number: string }
  amount: string
  status: string          // "success" | "pending" | "failed" | "processing" | "rejected"
  message: string
  trx_id: string
  trx_uuid: string
  created_at: string
  updated_at: string
  payment_method: number
}



export interface ApiResponse {
  status: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  data: Transaction[];
}