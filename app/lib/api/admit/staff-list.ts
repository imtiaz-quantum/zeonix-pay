import { serverGet } from "@/lib/server-get";
import { InitialPayload } from "../../types/userList";

export async function getStaffList(page = 1) {
  return serverGet<InitialPayload>(
    `/admin/user/?page=${page}&page_size=10`
  );
}