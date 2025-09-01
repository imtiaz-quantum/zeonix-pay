import UserListClient from "@/app/components/admin/UserListClient";
import { getUserList } from "@/app/lib/api/admit/user-list";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;             
  const page = Number(sp?.page) || 1;

  const payload = await getUserList(page);
  console.log(payload);

  return (
    <div>

      <UserListClient initialData={payload} currentPage={page} />
    </div>
  );
}
