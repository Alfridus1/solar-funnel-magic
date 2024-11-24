export interface Employee {
  id: string;
  profile_id: string;
  role: string;
  team_id?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  };
}