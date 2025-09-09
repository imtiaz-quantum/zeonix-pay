interface Device {
    id: number;
    device_name: string;
    device_key: string;
    device_pin: string;
    is_active: boolean;
    create_at: string; 
    updated_ta: string; 
    user: number;
}

interface DeviceListResponse {
    status: boolean;
    count: number;
    next: string | null;
    previous: string | null;
    data: Device[];
}
