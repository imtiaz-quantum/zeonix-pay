/* import { serverGet } from "@/lib/server-get";
type Device = {
    id: number;
    device_name: string;
    device_key: string;
    device_pin: string;
    is_active: boolean;
    create_at: string;
    updated_ta: string;
    user: number;
};

type ApiResponse = {
    status: boolean;
    count: number;
    next: string | null;
    previous: string | null;
    data: Device[];
};

export async function getDeviceList(page = 1) {
  return serverGet<ApiResponse>(
    `/admin/sms-device-keys/?page=${page}&page_size=10`
  );
} */


import { serverGet } from "@/lib/server-get";


export type DeviceFilters = {
  page?: number;
  page_size?: number;
  method?: string;
  is_active?: string;
  search?: string;                  // global search
  created_at_before?: string;       // YYYY-MM-DD
  created_at_after?: string;        // YYYY-MM-DD
};

export async function getDeviceList(filters: DeviceFilters) {
  const qs = new URLSearchParams();
  if (filters.method) qs.set("method", filters.method);
  if (filters.is_active) qs.set("is_active", filters.is_active);
  if (filters.search) qs.set("search", filters.search);
  if (filters.created_at_before) qs.set("created_at_before", filters.created_at_before);
  if (filters.created_at_after) qs.set("created_at_after", filters.created_at_after);
  qs.set("page", String(filters.page ?? 1));
  qs.set("page_size", String(filters.page_size ?? 10));

  return serverGet<DeviceListResponse>(`/admin/sms-device-keys/?${qs.toString()}`, { cache: "no-cache" });
}
  