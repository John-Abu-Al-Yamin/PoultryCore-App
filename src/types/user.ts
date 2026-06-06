export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  has_completed_setup: boolean;
  [key: string]: unknown;
}
