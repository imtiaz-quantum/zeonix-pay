import StaffListClient from "@/components/admin/StaffListClient";
import { getStaffList } from "@/app/lib/api/admit/staff-list";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;             
  const page = Number(sp?.page) || 1;
  const devicePage = false;
  const userListPromise = getStaffList(page, devicePage)


  return (
    <div>

      <StaffListClient userListPromise={userListPromise} currentPage={page} />
    </div>
  );
}
