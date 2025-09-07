import { serverGet } from "@/lib/server-get";
import { InitialPayload } from "../../types/userList";

export async function getStaffList(page = 1, devicePage: Boolean) {
  return serverGet<InitialPayload>(
     devicePage? `/admin/user/?all=true` : `/admin/user/?page=${page}&page_size=10`
  );
}