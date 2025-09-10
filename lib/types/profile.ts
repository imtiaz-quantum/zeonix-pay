export type ProfileData = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  status: string; // assuming only these two are possible
  role: string; // extend this as needed
  pid: string;
};

export interface ApiResponse {
  status: boolean;
  count: number;
  data: ProfileData[];
}