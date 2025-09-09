/* import { serverGet } from "@/lib/server-get";
import { InitialPayload } from "../../types/userList";

export async function getStaffList(page = 1, devicePage: boolean) {
  return serverGet<InitialPayload>(
     devicePage? `/admin/user/?all=true` : `/admin/user/?page=${page}&page_size=10`
  );
} */

import { serverGet } from "@/lib/server-get";
import { UsersListResponse } from "../../types/userList";
import { StaffListResponse } from "../../types/staffList";



export type StaffListFilters = {
  page?: number;
  page_size?: number;
  method?: string;
  status?: string;
  search?: string;                 
  created_at_before?: string;      
  created_at_after?: string;    
};

export async function getStaffList(filters: StaffListFilters) {
  const qs = new URLSearchParams();
  if (filters.method) qs.set("method", filters.method);
  if (filters.status) qs.set("status", filters.status);
  if (filters.search) qs.set("search", filters.search);
  if (filters.created_at_before) qs.set("created_at_before", filters.created_at_before);
  if (filters.created_at_after) qs.set("created_at_after", filters.created_at_after);
  qs.set("page", String(filters.page ?? 1));
  qs.set("page_size", String(filters.page_size ?? 10));

  return serverGet<StaffListResponse>(`/admin/user/?${qs.toString()}`, { cache: "no-cache" });
}  
