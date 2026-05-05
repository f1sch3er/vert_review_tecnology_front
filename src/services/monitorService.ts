import api from './api';

export const monitorService = {
  checkKafka: async () => {
    const response = await api.get('/health/kafka/'); 
    return response.data;
  },
}

 