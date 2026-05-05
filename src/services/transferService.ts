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
  getRecentActivity: async () => {
    const response = await api.get('/transactions/recent-activity/');
    return response.data;
  }
};