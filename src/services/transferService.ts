import type { TransferPayload } from '../types/transfer';
import api from './api';
import { v4 as uuidv4 } from 'uuid';


export const transferService = {
  transfer: async (data: TransferPayload) => {
    const idempotencyKey = uuidv4();

    const response = await api.post('/transactions/', data, {
      headers: {
        'idempotency_key': idempotencyKey 
      }
    });
    
    return response.data;
  },
  getRecentActivity: async (id?: string, limit?: number) => {
    if (id) {
      const { data } = await api.get(`/transactions/recent-activity/${id}/`);
      return data;
    }

    const params = limit ? { limit } : {};
    const { data } = await api.get('/transactions/recent-activity/', { params });
    return data;
  }
};