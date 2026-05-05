export interface Transaction {
  id: string | number;
  type_display: string;
  direction: 'IN' | 'OUT';
  amount: number;
  date_formatted: string;
}

export interface RecentActivityProps {
  transactions: Transaction[];
  loading: boolean;
  formatBalance: (value: number) => string;
  lang: 'PT' | 'EN';
}