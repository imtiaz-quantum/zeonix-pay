import UserListClient from "@/app/components/merchant/admin/UserListClient";
import { getUserList } from "@/app/lib/api/admit/user-list";

type PageProps = {
  searchParams?: { page?: string };
};

export default async function UsersPage({ searchParams }: PageProps) {
  const page = Number(searchParams?.page) || 1;
  const payload = await getUserList(page);
  return <UserListClient initialData={payload} currentPage={page} />;
}
