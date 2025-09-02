export interface ApiResponse {
    status: boolean;
    count: number;   // total items across pages
    next: string | null;
    previous: string | null;
    data: Payout[];  // current page items
}


export type Payout = {
    id: number
    store_name: string
    trx_id: string
    trx_uuid: string
    receiver_name: string
    receiver_number: string
    amount: string
    payment_method: string                    // e.g. "bkash"
    payment_details: { account_name: string; account_number: string }
    status: string                            // e.g. "success" | "pending" | "failed"
    created_at: string
    merchant: number
}