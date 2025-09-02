export type ApiResponse = {
  status: boolean;
  count: number;        // total rows across pages
  next: string | null;
  previous: string | null;
  data: Ledger[];       // current page rows
};


// ===== Types (match your API shape) =====
export type Ledger = {
  id: number;
  store_name: string;
  ip_address: string | null;
  object_id: number;
  amount: string;            // "5.00"
  fee: string;               // "0.50"
  net_amount: string;        // "4.50"
  previous_balance: string;  // "593.00"
  current_balance: string;   // "598.00"
  method: string;            // "bkash"
  status: string;            // "success" | "pending" | "failed" | etc
  created_at: string;        // ISO
  trx_id: string;            // "CHR90NBI43"
  trx_uuid: string;
  tran_type: string;         // "credit" | "debit"
  wallet: number;
  merchant: number;
  content_type: number;
};