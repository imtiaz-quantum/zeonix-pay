import DeviceList from "@/components/staff/deviceList";
import { getStaffList } from "@/lib/api/admit/staff-list";
import { getDeviceList } from "@/lib/api/admit/staff/deviceList";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    method?: string;
    is_active?: string;
    search?: string;
    created_at_before?: string;
    created_at_after?: string; 
  }>;
};
export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const page = Number(sp?.page) || 1;
  const method = sp?.method || undefined;
  const is_active = sp?.is_active || undefined;
  const search = sp?.search || undefined;
  const created_at_before = sp?.created_at_before || undefined;
  const created_at_after = sp?.created_at_after || undefined;

  const deviceListPromise = getDeviceList({
    page,
    page_size: 10,
    method,
    is_active,
    search,
    created_at_before,
    created_at_after,
  });
    const userListPromise = getStaffList({
    page,
    page_size: 10,
  });


  return (
    <div>

      <DeviceList deviceListPromise={deviceListPromise}  initialFilters={{ method, is_active, search }} userListPromise={userListPromise} currentPage={page} />
    </div>
  );
}
