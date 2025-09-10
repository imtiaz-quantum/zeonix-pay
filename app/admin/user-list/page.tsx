/* import UserListClient from "@/components/admin/UserListClient";
import { getUserList } from "@/app/lib/api/admit/user-list";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function UsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;             
  const page = Number(sp?.page) || 1;
  const userListPromise = getUserList(page)


  return (
    <div>

      <UserListClient userListPromise={userListPromise} currentPage={page} />
    </div>
  );
}
 */


import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Suspense } from "react";
import DepositTableSkeleton from "@/components/skeletons/DepositTableSkeleton";
import DepositTable from "@/components/deposit/DepositTable";
import { getUsersList } from "@/lib/api/admit/user-list";
import UserListClient from "@/components/admin/UserListClient";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    method?: string;
    status?: string;
    search?: string;
    created_at_before?: string;
    created_at_after?: string; 
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;

  const page = Number(sp?.page) || 1;
  const method = sp?.method || undefined;
  const status = sp?.status || undefined;
  const search = sp?.search || undefined;
  const created_at_before = sp?.created_at_before || undefined;
  const created_at_after = sp?.created_at_after || undefined;

  const userListPromise = getUsersList({
    page,
    page_size: 10,
    method,
    status,
    search,
    created_at_before,
    created_at_after,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Users List</CardTitle>
        <CardDescription>A list in your system.</CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<DepositTableSkeleton />}>
          <UserListClient
            userListPromise={userListPromise}
            currentPage={page}
            initialFilters={{ method, status, search }}
          />
        </Suspense>
      </CardContent>
    </Card>
  );
}
