export interface AccountData {
  id: number;
  owner: number;
  owner_name?: string;
  account_number: string;
  balance: string;
  blocked_balance: string;
  available_balance: number;
  created_at: string;
  updated_at: string;
}