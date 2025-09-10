export type Payout = {
  id: number
  store_name: string
  trx_id: string
  trx_uuid: string
  receiver_name: string
  receiver_number: string
  amount: string
  payment_method: string           
  payment_details: { account_name: string; account_number: string }
  status: string                         
  created_at: string
  merchant: number
}

export interface PayoutTotals {
  total_amount: number;
  pending_amount: number;
  success_amount: number;
  rejected_amount: number;
  delete_amount: number;
}

export interface PayoutListResponse {
  status: boolean;
  count: number;         
  next: string | null;
  previous: string | null;
  total_amount: PayoutTotals; 
  data: Payout[];   
}
