export interface StatsData {
    total_withdraw: string;
    withdraw_processing: string;
    failedWithdrawals: string;
    balance: string;
}

export interface ApiResponse {
    status: boolean;
    count: number;
    data: StatsData;
}