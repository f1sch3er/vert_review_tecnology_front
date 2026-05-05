import api from './api';
import type { AccountData } from '../types/account';
import { v4 as uuidv4 } from 'uuid';

export const accountService = {
  getMe: async (): Promise<AccountData> => {
    const { data } = await api.get<AccountData>('/accounts/me/');
    return data;
  },
  getAllAccounts: async (): Promise<AccountData[]> => {
    const response = await api.get('/accounts/all-accounts/');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/accounts/profile/');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.patch('/accounts/profile/', profileData);
    return response.data;
  },
  deposit: async (amount: string) => {
    const idempotencyKey = uuidv4();
    const externalCode = `DEP-${uuidv4().substring(0, 8).toUpperCase()}`;

    const response = await api.post('/accounts/deposit/', 
      {
        amount: amount, 
        external_code: externalCode
      },
      {
        headers: {
          'idempotency-key': idempotencyKey 
        }
      }
    );

    return response.data;
  }
};


