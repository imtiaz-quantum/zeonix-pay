export type ApiKeyItem = {
  id: number;
  api_key: string;
  secret_key: string;
  is_active: boolean;
  created_at: string;   // ISO datetime
  merchant: number;
};

export type ApiResponse<T> = {
  status: boolean;
  data: T;
};
