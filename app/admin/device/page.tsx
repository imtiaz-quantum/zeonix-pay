import DeviceList from "@/components/staff/deviceList";
import { getStaffList } from "@/app/lib/api/admit/staff-list";
import { getDeviceList } from "@/app/lib/api/admit/staff/deviceList";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;             
  const page = Number(sp?.page) || 1;
  const deviceListPromise = getDeviceList(page)
  const userListPromise = getStaffList(page, true)


  return (
    <div>

      <DeviceList deviceListPromise={deviceListPromise} userListPromise={userListPromise} currentPage={page} />
    </div>
  );
}
