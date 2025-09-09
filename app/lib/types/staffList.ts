interface Staff {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string;
  role: string;
  pid: string;
}


export type StaffListResponse = {
  status: boolean;
  count: number;
  next: string | null;
  previous: string | null;
  data: Staff[];
};
