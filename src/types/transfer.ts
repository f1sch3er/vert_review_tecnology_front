export type TransferType = 'PIX' | 'TED' | 'DOC' | 'DEPOSIT';

export interface TransferPayload {
  from_account: string | number; // Aceita string ou número
  to_account: string;
  idempotency_key: string;
  external_code: string;
  amount: string;
  transfer_type: TransferType;
  transfer_status: 'PENDING' | 'COMPLETED' | 'FAILED';
  from_account_balance_after?: string;
  to_account_balance_after?: string;
}