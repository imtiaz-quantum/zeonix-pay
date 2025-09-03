import StaffListClient from "@/app/components/admin/StaffListClient";
import DeviceList from "@/app/components/staff/deviceList";
import { getDeviceList } from "@/app/lib/api/admit/staff/deviceList";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;             
  const page = Number(sp?.page) || 1;
  const deviceListPromise = getDeviceList(page)


  return (
    <div>

      <DeviceList deviceListPromise={deviceListPromise} currentPage={page} />
    </div>
  );
}
