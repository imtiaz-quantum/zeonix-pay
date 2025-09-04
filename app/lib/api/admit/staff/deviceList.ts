import { serverGet } from "@/lib/server-get";
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
}