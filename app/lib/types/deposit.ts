export type Deposit = {
  id: number
  invoice_payment_id: string
  data: { key: string; code: string }
  method_payment_id: string
  customer_order_id: string
  customer_name: string
  customer_number: string
  customer_amount: string
  customer_email: string
  customer_address: string
  customer_description: string | null
  method: string            // e.g. "bkash"
  status: string            // e.g. "active" | "inactive" | "pending"
  pay_status: string        // e.g. "paid" | "unpaid" | "failed"
  transaction_id: string
  invoice_trxn: string
  extras: unknown | null
  created_at: string
  merchant: number
}

export interface ApiResponse {
  status: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  data: Deposit[];
}